import { HttpErrorResponse } from '@angular/common/http';
import { ApplicationRef, Component, createComponent, EnvironmentInjector, Injector, Input, OnChanges } from '@angular/core';
import Drawflow from 'drawflow';
import { catchError, forkJoin, throwError } from 'rxjs';
import { WorkflowstriggerApi } from '../api/workflowstrigger';
import { WorkflowsengineApi } from '../api/workflowsengine';
import { WorkflowsactionApi } from '../api/workflowsaction';
import { NotificationsService } from '../notifications/notifications.service';
import { WorkflowActionComponent } from './actions/workflowAction.component';
import { WorkflowEngineComponent } from './engines/workflowEngine.component';
import { WorkflowTriggerComponent } from './triggers/workflowTrigger.component';

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
        type: 'Create an item',
        name: 'Created',
        icon: 'plus',
      },
      {
        type: 'Update an item',
        name: 'Updated',
        icon: 'pen',
      },
      {
        type: 'Soft-delete an item',
        name: 'Soft deleted',
        icon: 'trash',
      },
      {
        type: 'Delete an item',
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
        type: 'FusionInventory inventory',
        name: 'FusionInventory inventory',
        icon: '',
      },
    ],
    engines: [
      {
        type: 'Check criteria',
        name: 'Check criteria',
        icon: 'filter',
      },
      {
        type: 'Get data',
        name: 'Get data',
        icon: 'grip',
      },
      {
        type: 'Rename',
        name: 'Rename value',
        icon: 'grip',
      },
      {
        type: 'searchitem',
        name: 'Search item',
        icon: 'magnifying-glass',
      },
      {
        type: 'fusionforeachitem',
        name: 'FusionInventory foreach item',
        icon: '',
      },
    ],
    actions: [
      {
        type: 'An action script',
        name: 'Action script',
        icon: 'scroll',
      },
      {
        type: 'Create an item',
        name: 'Create item',
        icon: 'plus',
      },
      {
        type: 'Update an item',
        name: 'Update item',
        icon: 'plus',
      },
      {
        type: 'Go to another type (FusionInventory)',
        name: 'Go to another type (FusionInventory)',
        icon: 'plus',
      },
      {
        type: 'Create event with datetime',
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
        triggerRes: this.workflowtriggerApi.list(this.typeId),
        engineRes: this.workflowengineApi.list(this.typeId),
        actionRes: this.workflowactionApi.list(this.typeId),
      })
        .subscribe(({ triggerRes, engineRes, actionRes }) => {
          this.enabledCreateConnection = false;
          for (const workflow of triggerRes) {
            const html = document.createElement('div');
            const data = {
              name: '',
              id: workflow.id,
              async: workflow.async,
              type: 'trigger',
              trigger_type: workflow.trigger_type,
            };
            this.flowchart.registerNode('test', html, null, null);
            this.flowchart.addNode('github', 0, 1, workflow.x, workflow.y, 'workflow__trigger', data, 'test', true);
          }
          for (const workflow of engineRes) {
            const html = document.createElement('div');
            const data = {
              name: '',
              id: workflow.id,
              type: 'engine',
              engine_type: workflow.engine_type,
              query: workflow.query,
            };
            this.flowchart.registerNode('test', html, null, null);
            this.flowchart.addNode('github', 1, 2, workflow.x, workflow.y, 'workflow__engine', data, 'test', true);
          }
          for (const workflow of actionRes) {
            const html = document.createElement('div');
            const data = {
              name: '',
              id: workflow.id,
              type: 'action',
              action_type: workflow.action_type,
            };
            this.flowchart.registerNode('test', html, null, null);
            this.flowchart.addNode('github', 1, 2, workflow.x, workflow.y, 'workflow__action', data, 'test', true);
          }

          // Get relationships
          setTimeout(() => {
            for (const workflow of triggerRes) {
              for (const connection of workflow.child_engine_connections) {
                const outputId = Object.keys(this.mappingNodeIdDBId.trigger).find(key => this.mappingNodeIdDBId.trigger[key] === workflow.id);
                const inputId = Object.keys(this.mappingNodeIdDBId.engine).find(key => this.mappingNodeIdDBId.engine[key] === connection.id);
                if (outputId !== undefined && inputId !== undefined) {
                  this.flowchart.addConnection(outputId, inputId, 'output_1', 'input_1');
                }
              }
              for (const connection of workflow.child_action_connections) {
                const outputId = Object.keys(this.mappingNodeIdDBId.trigger).find(key => this.mappingNodeIdDBId.trigger[key] === workflow.id);
                const inputId = Object.keys(this.mappingNodeIdDBId.action).find(key => this.mappingNodeIdDBId.action[key] === connection.id);
                if (outputId !== undefined && inputId !== undefined) {
                  this.flowchart.addConnection(outputId, inputId, 'output_1', 'input_1');
                }
              }
            }
            for (const workflow of engineRes) {
              for (const connection of workflow.child_engine_connections_validate) {
                const outputId = Object.keys(this.mappingNodeIdDBId.engine).find(key => this.mappingNodeIdDBId.engine[key] === workflow.id);
                const inputId = Object.keys(this.mappingNodeIdDBId.engine).find(key => this.mappingNodeIdDBId.engine[key] === connection.id);
                if (outputId !== undefined && inputId !== undefined) {
                  this.flowchart.addConnection(outputId, inputId, 'output_1', 'input_1');
                }
              }
              for (const connection of workflow.child_engine_connections_notvalidate) {
                const outputId = Object.keys(this.mappingNodeIdDBId.engine).find(key => this.mappingNodeIdDBId.engine[key] === workflow.id);
                const inputId = Object.keys(this.mappingNodeIdDBId.engine).find(key => this.mappingNodeIdDBId.engine[key] === connection.id);
                if (outputId !== undefined && inputId !== undefined) {
                  this.flowchart.addConnection(outputId, inputId, 'output_2', 'input_1');
                }
              }
              for (const connection of workflow.child_action_connections_validate) {
                const outputId = Object.keys(this.mappingNodeIdDBId.engine).find(key => this.mappingNodeIdDBId.engine[key] === workflow.id);
                const inputId = Object.keys(this.mappingNodeIdDBId.action).find(key => this.mappingNodeIdDBId.action[key] === connection.id);
                if (outputId !== undefined && inputId !== undefined) {
                  this.flowchart.addConnection(outputId, inputId, 'output_1', 'input_1');
                }
              }
              for (const connection of workflow.child_action_connections_notvalidate) {
                const outputId = Object.keys(this.mappingNodeIdDBId.engine).find(key => this.mappingNodeIdDBId.engine[key] === workflow.id);
                const inputId = Object.keys(this.mappingNodeIdDBId.action).find(key => this.mappingNodeIdDBId.action[key] === connection.id);
                if (outputId !== undefined && inputId !== undefined) {
                  this.flowchart.addConnection(outputId, inputId, 'output_2', 'input_1');
                }
              }
            }
            for (const workflow of actionRes) {
              for (const connection of workflow.child_engine_connections_validate) {
                const outputId = Object.keys(this.mappingNodeIdDBId.action).find(key => this.mappingNodeIdDBId.action[key] === workflow.id);
                const inputId = Object.keys(this.mappingNodeIdDBId.engine).find(key => this.mappingNodeIdDBId.engine[key] === connection.id);
                if (outputId !== undefined && inputId !== undefined) {
                  this.flowchart.addConnection(outputId, inputId, 'output_1', 'input_1');
                }
              }
              for (const connection of workflow.child_engine_connections_notvalidate) {
                const outputId = Object.keys(this.mappingNodeIdDBId.action).find(key => this.mappingNodeIdDBId.action[key] === workflow.id);
                const inputId = Object.keys(this.mappingNodeIdDBId.engine).find(key => this.mappingNodeIdDBId.engine[key] === connection.id);
                if (outputId !== undefined && inputId !== undefined) {
                  this.flowchart.addConnection(outputId, inputId, 'output_2', 'input_1');
                }
              }
              for (const connection of workflow.child_action_connections_validate) {
                const outputId = Object.keys(this.mappingNodeIdDBId.action).find(key => this.mappingNodeIdDBId.action[key] === workflow.id);
                const inputId = Object.keys(this.mappingNodeIdDBId.action).find(key => this.mappingNodeIdDBId.action[key] === connection.id);
                if (outputId !== undefined && inputId !== undefined) {
                  this.flowchart.addConnection(outputId, inputId, 'output_1', 'input_1');
                }
              }
              for (const connection of workflow.child_action_connections_notvalidate) {
                const outputId = Object.keys(this.mappingNodeIdDBId.action).find(key => this.mappingNodeIdDBId.action[key] === workflow.id);
                const inputId = Object.keys(this.mappingNodeIdDBId.action).find(key => this.mappingNodeIdDBId.action[key] === connection.id);
                if (outputId !== undefined && inputId !== undefined) {
                  this.flowchart.addConnection(outputId, inputId, 'output_2', 'input_1');
                }
              }
            }
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
          trigger_type: ev.data,
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
          engine_type: ev.data,
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
          action_type: ev.data,
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
    let dialogRef;

    if (ev.data.type === 'trigger') {
      dialogRef = createComponent(WorkflowTriggerComponent, {
        environmentInjector: this.envInjector,
        hostElement: document.getElementById('node-' + ev.id)?.querySelector('.drawflow_content_node')!,
      });
      dialogRef.setInput('data', {
        type: ev.data.type,
        subtype: ev.data.trigger_type,
        async: ev.data.async,
        id: ev.data.id,
      });
    } else if (ev.data.type === 'engine') {
      dialogRef = createComponent(WorkflowEngineComponent, {
        environmentInjector: this.envInjector,
        hostElement: document.getElementById('node-' + ev.id)?.querySelector('.drawflow_content_node')!,
      });
      dialogRef.setInput('data', {
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
        type: ev.data.type,
        subtype: ev.data.action_type,
        id: ev.data.id,
      });
    } else {
      return;
    }

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
    let validate: boolean = true;
    if (data.output_class === 'output_2') {
      validate = false;
    }
    // get type of workflow and the backend id (in the mapping) of the output
    const output = this.getTypeAndBackendId(data.output_id);
    // get type of workflow and the backend id (in the mapping) of the input
    const input = this.getTypeAndBackendId(data.input_id);
    let connectionApi;
    if (output !== undefined && input !== undefined) {
      if (output.type === 'trigger') {
        if (input.type === 'engine') {
          connectionApi = this.workflowtriggerApi.createConnectionEngine(output.id, input.id);
        }
        if (input.type === 'action') {
          connectionApi = this.workflowtriggerApi.createConnectionAction(output.id, input.id);
        }
      } else if (output.type === 'engine') {
        if (input.type === 'engine') {
          connectionApi = this.workflowengineApi.createConnectionEngine(output.id, input.id, validate);
        }
        if (input.type === 'action') {
          connectionApi = this.workflowengineApi.createConnectionAction(output.id, input.id, validate);
        }
      } else if (output.type === 'action') {
        if (input.type === 'engine') {
          connectionApi = this.workflowactionApi.createConnectionEngine(output.id, input.id, validate);
        }
        if (input.type === 'action') {
          connectionApi = this.workflowactionApi.createConnectionAction(output.id, input.id, validate);
        }
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
    let inputType: 'engine'|'action' = 'engine';

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
      inputType = 'action';
    }

    if (outputId !== undefined && inputId !== undefined && connectionApi !== undefined) {
      connectionApi.deleteConnection(outputId, inputId, inputType)
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
}