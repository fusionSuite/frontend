import { HttpErrorResponse } from '@angular/common/http';
import { ApplicationRef, Component, createComponent, EnvironmentInjector, Injector, Input, OnChanges } from '@angular/core';
import Drawflow from 'drawflow';
import { catchError, forkJoin, of, throwError } from 'rxjs';
import { WorkflowstriggerApi } from '../api/workflowstrigger';
import { WorkflowsengineApi } from '../api/workflowsengine';
import { WorkflowsactionApi } from '../api/workflowsaction';
import { NotificationsService } from '../notifications/notifications.service';
import { WorkflowActionComponent } from './actions/workflowAction.component';
import { WorkflowEngineComponent } from './engines/workflowEngine.component';
import { WorkflowTriggerComponent } from './triggers/workflowTrigger.component';
import { IWorkflowsForkjoin } from '../interfaces/workflowForkjoin';

@Component({
  selector: 'app-workflow',
  templateUrl: './workflow.component.html',
})
export class WorkflowComponent implements OnChanges {
  @Input() typeId: number = 0;

  public flowchart!: Drawflow;
  public currentNodeId: number = 0;
  public scriptActions: {name: string;internalname: string}[] = [];
  public configPanel = 'blocks';
  public panelId = 0;
  public panelType = '';
  public draggable = {
    // note that data is handled with JSON.stringify/JSON.parse
    // only set simple data or POJO's as methods will be lost
    data: 'myDragData',
    effectAllowed: 'all',
    disable: false,
    handle: false,
  };

  public blocks = {
    triggers: [
      {
        type: 'createitem',
        name: 'Created',
        icon: 'plus',
      },
      {
        type: 'updateitem',
        name: 'Updated',
        icon: 'pen',
      },
      {
        type: 'softdeleteitem',
        name: 'Soft deleted',
        icon: 'trash',
      },
      {
        type: 'deleteitem',
        name: 'Deleted',
        icon: 'xmark',
      },
      {
        type: 'datetime',
        name: 'Datetime (event)',
        icon: 'calendar',
      },
      {
        type: 'webhook',
        name: 'Webhook',
        icon: '',
      },
      {
        type: 'fusioninventory',
        name: 'FusionInventory inventory',
        icon: '',
      },
    ],
    engines: [
      {
        type: 'checkcriteria',
        name: 'Check criteria',
        icon: 'filter',
      },
      {
        type: 'getdata',
        name: 'Get data',
        icon: 'grip',
      },
      {
        type: 'transformdata',
        name: 'Transform data',
        icon: 'grip',
      },
      {
        type: 'searchitem',
        name: 'Search item',
        icon: 'magnifying-glass',
      },
    ],
    actions: [
      {
        type: 'actionscript',
        name: 'Action script',
        icon: 'scroll',
      },
      {
        type: 'createitem',
        name: 'Create item',
        icon: 'plus',
      },
      {
        type: 'updateitem',
        name: 'Update item',
        icon: 'plus',
      },
      {
        type: 'fusioninventorytoanothertype',
        name: 'Go to another type (FusionInventory)',
        icon: 'plus',
      },
      // {
      //   type: 'associateitemtoproperty',
      //   name: 'Associate item to property of previous item',
      //   icon: 'plus',
      // },
      {
        type: 'createventdatetime',
        name: 'Create event with datetime',
        icon: '',
      },
    ],
  };

  private translate = {
    x: 0,
    y: 0,
  };

  private zoom = 1;
  private mappingNodeIdDBId: any = {
    trigger: {},
    engine: {},
    action: {},
  };

  private enabledCreateConnection = true;
  // links with key output, values = inputs + variables (so end to begin)
  private links: any = {};
  public variables: any = {};

  private myDialogRef: any = {};

  constructor (
    private workflowtriggerApi:WorkflowstriggerApi,
    private workflowengineApi:WorkflowsengineApi,
    private workflowactionApi:WorkflowsactionApi,
    private notificationsService: NotificationsService,
    private injector: Injector,
    private envInjector: EnvironmentInjector,
  ) {
    console.log('on the constructor');
    this.scriptActions.push({
      name: 'RuleAction Zabbix create host',
      internalname: 'ruleaction.zabbix.createhost',
    });
    this.scriptActions.push({
      name: 'RuleAction Mail notification information',
      internalname: 'ruleaction.mailnotification.config',
    });
  }

  ngOnChanges (): void {
    const id = document.getElementById('drawflowDiv');
    if (id !== null) {
      this.flowchart = new Drawflow(id);
      this.flowchart.start();

      this.flowchart.on('nodeCreated', (id: number) => {
        this.onNodeCreated(this.flowchart.getNodeFromId(id));
      });

      this.flowchart.on('nodeMoved', (id: number) => {
        this.onNodeMoved(this.flowchart.getNodeFromId(id));
      });

      this.flowchart.on('clickEnd', (ev) => {
      });

      this.flowchart.on('nodeSelected', (id: number) => {
        this.currentNodeId = id;
      });

      this.flowchart.on('connectionCreated', (data) => {
        if (this.enabledCreateConnection) {
          this.onConnectionCreated(data);
        }
      });

      this.flowchart.on('connectionRemoved', (data) => {
        this.onConnectionRemoved(data);
      });

      this.flowchart.on('nodeRemoved', (id: number) => {
        this.onNodeDeleted(id);
      });

      this.flowchart.on('translate', (data) => {
        this.translate.x = data.x;
        this.translate.y = data.y;
      });

      this.flowchart.on('zoom', (zoom) => {
        this.zoom = zoom;
      });

      this.flowchart.on('nodeSelected', (id) => {
        const node = this.flowchart.getNodeFromId(id);
        this.panelId = node.data.id;
        if (node.data.type === 'engine') {
          this.panelType = node.data.engine_type;
          this.configPanel = 'engine';
        } else if (node.data.type === 'trigger') {
          console.log(node.data);
          this.panelType = node.data.trigger_type;
          this.configPanel = 'trigger';
        } else if (node.data.type === 'action') {
          this.panelType = node.data.action_type;
          this.configPanel = 'action';
        }
      });

      this.flowchart.on('nodeUnselected', (val) => {
        this.configPanel = 'blocks';
      });

      // use forkjoin
      forkJoin({
        triggerRes: this.workflowtriggerApi.list(this.typeId).pipe(catchError(error => of(error))),
        engineRes: this.workflowengineApi.list(this.typeId).pipe(catchError(error => of(error))),
        actionRes: this.workflowactionApi.list(this.typeId).pipe(catchError(error => of(error))),
      })
        .subscribe(({ triggerRes, engineRes, actionRes }: IWorkflowsForkjoin) => {
          this.enabledCreateConnection = false;
          // trigger
          for (const workflow of triggerRes) {
            this.variables[workflow.id] = [];
            const html = document.createElement('div');
            // const async = workflow.properties.find((item: any) => item.name === 'async');
            const async = { value: true };
            const data = {
              name: workflow.name,
              id: workflow.id,
              async: async.value,
              type: 'trigger',
              trigger_type: workflow.category,
              itemBackend: workflow,
            };
            this.flowchart.registerNode('test', html, null, null);
            this.flowchart.addNode('github', 0, 1, workflow.x, workflow.y, 'workflow__trigger', data, 'test', true);
          }
          // engine
          for (const workflow of engineRes) {
            this.variables[workflow.id] = [];
            const html = document.createElement('div');
            const data = {
              name: workflow.name,
              id: workflow.id,
              type: 'engine',
              engine_type: workflow.category,
              query: '',
            };
            this.flowchart.registerNode('test', html, null, null);
            this.flowchart.addNode('github', 1, 2, workflow.x, workflow.y, 'workflow__engine', data, 'test', true);
          }
          // action
          if (typeof actionRes === 'string') {
            console.log(actionRes);
          } else {
            for (const workflow of actionRes) {
              this.variables[workflow.id] = [];
              const html = document.createElement('div');
              const data = {
                name: workflow.name,
                id: workflow.id,
                type: 'action',
                action_type: workflow.category,
              };
              this.flowchart.registerNode('test', html, null, null);
              this.flowchart.addNode('github', 1, 2, workflow.x, workflow.y, 'workflow__action', data, 'test', true);
            }
          }
          // Get relationships
          setTimeout(() => {
            for (const workflow of triggerRes) {
              for (const connection of workflow.children) {
                if (connection.type === 'engine') {
                  const outputId = Object.keys(this.mappingNodeIdDBId.trigger).find(key => this.mappingNodeIdDBId.trigger[key] === workflow.id);
                  const inputId = Object.keys(this.mappingNodeIdDBId.engine).find(key => this.mappingNodeIdDBId.engine[key] === connection.id);
                  if (outputId !== undefined && inputId !== undefined) {
                    this.flowchart.addConnection(outputId, inputId, 'output_1', 'input_1');
                  }
                } else if (connection.type === 'action') {
                  const outputId = Object.keys(this.mappingNodeIdDBId.trigger).find(key => this.mappingNodeIdDBId.trigger[key] === workflow.id);
                  const inputId = Object.keys(this.mappingNodeIdDBId.action).find(key => this.mappingNodeIdDBId.action[key] === connection.id);
                  if (outputId !== undefined && inputId !== undefined) {
                    this.flowchart.addConnection(outputId, inputId, 'output_1', 'input_1');
                  }
                }
              }
            }
            for (const workflow of engineRes) {
              for (const connection of workflow.children) {
                if (connection.type === 'engine') {
                  const outputId = Object.keys(this.mappingNodeIdDBId.engine).find(key => this.mappingNodeIdDBId.engine[key] === workflow.id);
                  const inputId = Object.keys(this.mappingNodeIdDBId.engine).find(key => this.mappingNodeIdDBId.engine[key] === connection.id);
                  if (outputId !== undefined && inputId !== undefined) {
                    this.flowchart.addConnection(outputId, inputId, 'output_1', 'input_1');
                    this.setLink(connection.id, workflow.id, workflow.variable);
                  }
                } else if (connection.type === 'action') {
                  const outputId = Object.keys(this.mappingNodeIdDBId.engine).find(key => this.mappingNodeIdDBId.engine[key] === workflow.id);
                  const inputId = Object.keys(this.mappingNodeIdDBId.action).find(key => this.mappingNodeIdDBId.action[key] === connection.id);
                  if (outputId !== undefined && inputId !== undefined) {
                    this.flowchart.addConnection(outputId, inputId, 'output_1', 'input_1');
                    this.setLink(connection.id, workflow.id, workflow.variable);
                  }
                }
              }
              for (const connection of workflow.children_error) {
                if (connection.type === 'engine') {
                  const outputId = Object.keys(this.mappingNodeIdDBId.engine).find(key => this.mappingNodeIdDBId.engine[key] === workflow.id);
                  const inputId = Object.keys(this.mappingNodeIdDBId.engine).find(key => this.mappingNodeIdDBId.engine[key] === connection.id);
                  if (outputId !== undefined && inputId !== undefined) {
                    this.flowchart.addConnection(outputId, inputId, 'output_2', 'input_1');
                    this.setLink(connection.id, workflow.id, workflow.variable);
                  }
                } else if (connection.type === 'action') {
                  const outputId = Object.keys(this.mappingNodeIdDBId.engine).find(key => this.mappingNodeIdDBId.engine[key] === workflow.id);
                  const inputId = Object.keys(this.mappingNodeIdDBId.action).find(key => this.mappingNodeIdDBId.action[key] === connection.id);
                  if (outputId !== undefined && inputId !== undefined) {
                    this.flowchart.addConnection(outputId, inputId, 'output_2', 'input_1');
                    this.setLink(connection.id, workflow.id, workflow.variable);
                  }
                }
              }
            }
            for (const workflow of actionRes) {
              for (const connection of workflow.children) {
                const outputId = Object.keys(this.mappingNodeIdDBId.action).find(key => this.mappingNodeIdDBId.action[key] === workflow.id);
                const inputId = Object.keys(this.mappingNodeIdDBId.action).find(key => this.mappingNodeIdDBId.action[key] === connection.id);
                if (outputId !== undefined && inputId !== undefined) {
                  this.flowchart.addConnection(outputId, inputId, 'output_1', 'input_1');
                  this.setLink(connection.id, workflow.id, null);
                }
              }
              for (const connection of workflow.children_error) {
                const outputId = Object.keys(this.mappingNodeIdDBId.action).find(key => this.mappingNodeIdDBId.action[key] === workflow.id);
                const inputId = Object.keys(this.mappingNodeIdDBId.action).find(key => this.mappingNodeIdDBId.action[key] === connection.id);
                if (outputId !== undefined && inputId !== undefined) {
                  this.flowchart.addConnection(outputId, inputId, 'output_2', 'input_1');
                  this.setLink(connection.id, workflow.id, null);
                }
              }
            }
            this.getAllVariables();
            this.flowchart.zoom_out();
            this.flowchart.zoom_out();
            this.flowchart.zoom_out();
            this.flowchart.zoom_out();
            this.enabledCreateConnection = true;
          }, 200);
        });
    }
  }

  public onDrop (ev: any) {
    console.log(ev);
    const drawDiv = document.getElementById('drawflowDiv');
    if (drawDiv !== null) {
      // const drawDivRect = drawDiv.getBoundingClientRect();
      // const x = Math.ceil((ev.event.x - drawDivRect.x) - 50);
      // const y = Math.ceil((ev.event.y - drawDivRect.y) - 50);

      const x = Math.ceil(ev.event.layerX - (this.translate.x / this.zoom));
      const y = Math.ceil(ev.event.layerY - (this.translate.y / this.zoom));

      if (ev.type === 'trigger') {
        // Create workflow in backend
        const backData = {
          name: ev.data,
          type_id: this.typeId,
          category: ev.data,
          x,
          y,
        };
        this.workflowtriggerApi.create(backData)
          .pipe(
            catchError((error: HttpErrorResponse) => {
              this.notificationsService.error(error.error.message);
              return throwError(() => new Error(error.error.message));
            }),
          ).subscribe((result: any) => {
            // Reset the form to its initial state
            this.notificationsService.success($localize `The item has been created successfully.`);

            const html = document.createElement('div');
            const data = {
              name: '',
              id: result.id,
              async: false,
              type: ev.type,
              trigger_type: ev.data,
            };

            this.flowchart.registerNode('test', html, null, null);
            this.flowchart.addNode('github', 0, 1, x, y, 'workflow__trigger', data, 'test', true);
          });
      } else if (ev.type === 'engine') {
        // Create workflow in backend
        const backData = {
          name: ev.data,
          type_id: this.typeId,
          category: ev.data,
          x,
          y,
        };
        this.workflowengineApi.create(backData)
          .pipe(
            catchError((error: HttpErrorResponse) => {
              this.notificationsService.error(error.error.message);
              return throwError(() => new Error(error.error.message));
            }),
          ).subscribe((result: any) => {
            // Reset the form to its initial state
            this.notificationsService.success($localize `The item has been created successfully.`);

            const html = document.createElement('div');
            const data = {
              name: '',
              id: result.id,
              async: false,
              type: ev.type,
              engine_type: ev.data,
            };

            this.flowchart.registerNode('test', html, null, null);
            this.flowchart.addNode('github', 1, 2, x, y, 'workflow__engine', data, 'test', true);
          });
      } else if (ev.type === 'action') {
        // Create workflow in backend
        const backData = {
          name: ev.data,
          type_id: this.typeId,
          category: ev.data,
          query: '',
          x,
          y,
        };
        this.workflowactionApi.create(backData)
          .pipe(
            catchError((error: HttpErrorResponse) => {
              this.notificationsService.error(error.error.message);
              return throwError(() => new Error(error.error.message));
            }),
          ).subscribe((result: any) => {
            // Reset the form to its initial state
            this.notificationsService.success($localize `The item has been created successfully.`);

            const html = document.createElement('div');
            const data = {
              name: '',
              id: result.id,
              type: ev.type,
              action_type: ev.data,
            };

            this.flowchart.registerNode('test', html, null, null);
            this.flowchart.addNode('github', 1, 2, x, y, 'workflow__action', data, 'test', true);
          });
      }
    }
  }

  public onNodeMoved (ev: any) {
    console.log(ev);
    if (ev.pos_x !== undefined) {
      if (ev.data.type === 'trigger') {
        const backData = {
          x: Math.ceil(ev.pos_x),
          y: Math.ceil(ev.pos_y),
        };
        this.workflowtriggerApi.update(ev.data.id, backData)
          .pipe(
            catchError((error: HttpErrorResponse) => {
              this.notificationsService.error(error.error.message);
              return throwError(() => new Error(error.error.message));
            }),
          ).subscribe((result: any) => {
            // Reset the form to its initial state
            // this.notificationsService.success($localize `The item has been updated successfully.`);
          });
      } else if (ev.data.type === 'engine') {
        const backData = {
          x: Math.ceil(ev.pos_x),
          y: Math.ceil(ev.pos_y),
        };
        this.workflowengineApi.update(ev.data.id, backData)
          .pipe(
            catchError((error: HttpErrorResponse) => {
              this.notificationsService.error(error.error.message);
              return throwError(() => new Error(error.error.message));
            }),
          ).subscribe((result: any) => {
            // Reset the form to its initial state
            // this.notificationsService.success($localize `The item has been updated successfully.`);
          });
      } else if (ev.data.type === 'action') {
        const backData = {
          x: Math.ceil(ev.pos_x),
          y: Math.ceil(ev.pos_y),
        };
        this.workflowactionApi.update(ev.data.id, backData)
          .pipe(
            catchError((error: HttpErrorResponse) => {
              this.notificationsService.error(error.error.message);
              return throwError(() => new Error(error.error.message));
            }),
          ).subscribe((result: any) => {
            // Reset the form to its initial state
            // this.notificationsService.success($localize `The item has been updated successfully.`);
          });
      }
    }
  }

  public changeTriggerData (data: any) {
    console.log(data);
  }

  private onNodeCreated (ev: any) {
    const appRef = this.injector.get(ApplicationRef);
    let dialogRef: any;

    if (ev.data.type === 'trigger') {
      dialogRef = createComponent(WorkflowTriggerComponent, {
        environmentInjector: this.envInjector,
        hostElement: document.getElementById('node-' + ev.id)?.querySelector('.drawflow_content_node')!,
      });
      dialogRef.setInput('data', {
        name: ev.data.name,
        type: ev.data.type,
        subtype: ev.data.trigger_type,
        async: ev.data.async,
        id: ev.data.id,
        itemBackend: ev.data.itemBackend,
      });
      dialogRef.instance.testResult.subscribe((res: any) => {
        this.setTestResult(res, dialogRef);
      });
    } else if (ev.data.type === 'engine') {
      dialogRef = createComponent(WorkflowEngineComponent, {
        environmentInjector: this.envInjector,
        hostElement: document.getElementById('node-' + ev.id)?.querySelector('.drawflow_content_node')!,
      });
      dialogRef.setInput('data', {
        name: ev.data.name,
        type: ev.data.type,
        subtype: ev.data.engine_type,
        id: ev.data.id,
        query: ev.data.query,
      });
    } else if (ev.data.type === 'action') {
      dialogRef = createComponent(WorkflowActionComponent, {
        environmentInjector: this.envInjector,
        hostElement: document.getElementById('node-' + ev.id)?.querySelector('.drawflow_content_node')!,
      });
      dialogRef.setInput('data', {
        name: ev.data.name,
        type: ev.data.type,
        subtype: ev.data.action_type,
        id: ev.data.id,
      });
    } else {
      return;
    }

    this.myDialogRef[ev.data.id] = dialogRef;
    appRef.attachView(dialogRef.hostView);
    this.mappingNodeIdDBId[ev.data.type][ev.id] = ev.data.id;
  }

  private onNodeDeleted (nodeId: number) {
    let backendId;
    let api;
    if (this.mappingNodeIdDBId.trigger[nodeId] !== undefined) {
      backendId = this.mappingNodeIdDBId.trigger[nodeId];
      api = this.workflowtriggerApi;
    } else if (this.mappingNodeIdDBId.engine[nodeId] !== undefined) {
      backendId = this.mappingNodeIdDBId.engine[nodeId];
      api = this.workflowengineApi;
    } else if (this.mappingNodeIdDBId.action[nodeId] !== undefined) {
      backendId = this.mappingNodeIdDBId.action[nodeId];
      api = this.workflowactionApi;
    }
    if (backendId !== undefined && api !== undefined) {
      api.delete(backendId)
        .pipe(
          catchError((error: HttpErrorResponse) => {
            this.notificationsService.error(error.error.message);
            return throwError(() => new Error(error.error.message));
          }),
        ).subscribe((result: any) => {
          delete this.mappingNodeIdDBId[nodeId];
          // Reset the form to its initial state
          // this.notificationsService.success($localize `The item has been updated successfully.`);
        });
    } else {
      const error = 'Mapping problem, create an issue';
      this.notificationsService.error(error);
    }
  }

  private onConnectionCreated (data: any) {
    console.log(data);
    let success: boolean = true;
    if (data.output_class === 'output_2') {
      success = false;
    }
    // get type of workflow and the backend id (in the mapping) of the output
    const output = this.getTypeAndBackendId(data.output_id);
    // get type of workflow and the backend id (in the mapping) of the input
    const input = this.getTypeAndBackendId(data.input_id);
    let connectionApi;
    if (output !== undefined && input !== undefined) {
      if (output.type === 'trigger') {
        connectionApi = this.workflowtriggerApi.createConnection(output.id, input.id);
      } else if (output.type === 'engine') {
        connectionApi = this.workflowengineApi.createConnection(output.id, input.id, success);
      } else if (output.type === 'action') {
        connectionApi = this.workflowactionApi.createConnection(output.id, input.id, success);
      }
      if (connectionApi !== undefined) {
        connectionApi
          .pipe(
            catchError((error: HttpErrorResponse) => {
              this.notificationsService.error(error.error.message);
              return throwError(() => new Error(error.error.message));
            }),
          ).subscribe((result: any) => {
            // Reset the form to its initial state
            this.notificationsService.success($localize `The connection has been created successfully.`);
          });
      }
    }
  }

  private onConnectionRemoved (data: any) {
    let outputId;
    let inputId;
    let connectionApi;

    if (this.mappingNodeIdDBId.trigger[data.output_id] !== undefined) {
      connectionApi = this.workflowtriggerApi;
      outputId = this.mappingNodeIdDBId.trigger[data.output_id];
    } else if (this.mappingNodeIdDBId.engine[data.output_id] !== undefined) {
      connectionApi = this.workflowengineApi;
      outputId = this.mappingNodeIdDBId.engine[data.output_id];
    } else if (this.mappingNodeIdDBId.action[data.output_id] !== undefined) {
      connectionApi = this.workflowactionApi;
      outputId = this.mappingNodeIdDBId.action[data.output_id];
    }

    if (this.mappingNodeIdDBId.engine[data.input_id] !== undefined) {
      inputId = this.mappingNodeIdDBId.engine[data.input_id];
    } else if (this.mappingNodeIdDBId.action[data.input_id] !== undefined) {
      inputId = this.mappingNodeIdDBId.action[data.input_id];
    }

    if (outputId !== undefined && inputId !== undefined && connectionApi !== undefined) {
      let connectionType = 'success';
      if (data.output_class === 'output_2') {
        connectionType = 'error';
      }
      connectionApi.deleteConnection(outputId, inputId, connectionType)
        .pipe(
          catchError((error: HttpErrorResponse) => {
            this.notificationsService.error(error.error.message);
            return throwError(() => new Error(error.error.message));
          }),
        ).subscribe((result: any) => {
          // Reset the form to its initial state
          this.notificationsService.success($localize `The connection has been deleted successfully.`);
        });
    }
  }

  private getTypeAndBackendId (internalId: number) {
    const data = {
      id: 0,
      type: '',
    };
    if (internalId in this.mappingNodeIdDBId.trigger) {
      data.id = this.mappingNodeIdDBId.trigger[internalId];
      data.type = 'trigger';
      return data;
    }
    if (internalId in this.mappingNodeIdDBId.engine) {
      data.id = this.mappingNodeIdDBId.engine[internalId];
      data.type = 'engine';
      return data;
    }
    if (internalId in this.mappingNodeIdDBId.action) {
      data.id = this.mappingNodeIdDBId.action[internalId];
      data.type = 'action';
      return data;
    }
    return undefined;
  }

  public clickMe (ev: Event) {
    console.log(ev);
  }

  private setLink (outputId: number, inputId: number, variable: any|null) {
    if (!(outputId in this.links)) {
      this.links[outputId] = [];
    }

    this.links[outputId].push(
      {
        inputId,
        variable,
      },
    );
  }

  private getAllVariables () {
    for (const workflowId in this.variables) {
      this.variables[workflowId] = this.getVariablesByLinks(parseInt(workflowId, 10));
    }
  }

  private getVariablesByLinks (inputId: number, variables: string[] = []) {
    if (inputId in this.links) {
      for (const output of this.links[inputId]) {
        variables = this.getVariablesByLinks(output.outputId, variables);
        variables.push(output.variable);
      }
    }
    return variables;
  }

  /**
   * Manage the workflows tests from trigger FusionInventory
   *
   * @param data
   */
  public setTestResult (data: any, dialogRef: any) {
    for (const id in this.myDialogRef) {
      this.myDialogRef[id].setInput('testingData', undefined);
    }
    for (const testingData of data) {
      let currentData = this.myDialogRef[testingData.workflowId].instance.testingData;
      if (currentData === undefined) {
        currentData = [];
      }
      currentData.push(testingData);
      this.myDialogRef[testingData.workflowId].setInput('testingData', currentData);
    }
  }
}
