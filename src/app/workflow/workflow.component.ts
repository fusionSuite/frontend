import { Component, Input, OnChanges } from '@angular/core';
import Drawflow from 'drawflow';
import { DndDropEvent } from 'ngx-drag-drop';

@Component({
  selector: 'app-workflow',
  templateUrl: './workflow.component.html',
})
export class WorkflowComponent implements OnChanges {
  @Input() typeId: number = 0;

  public flowchart!: Drawflow;
  public currentNodeId: number = 0;
  public scriptActions: {name: string;internalname: string}[] = [];
  public draggable = {
    // note that data is handled with JSON.stringify/JSON.parse
    // only set simple data or POJO's as methods will be lost
    data: 'myDragData',
    effectAllowed: 'all',
    disable: false,
    handle: false,
  };

  constructor (
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

      this.flowchart.on('nodeMoved', (id: number) => {
        console.log(this.flowchart.getNodeFromId(id));
      });

      this.flowchart.on('clickEnd', (ev) => {
        console.log(ev);
      });

      this.flowchart.on('nodeSelected', (id) => {
        this.currentNodeId = id;
        console.log('Node selected: ' + id);
      });

      this.flowchart.on('connectionCreated', (data) => {
        console.log(data);
        // we have:
        //  * input_class: "input_1"
        //  * input_id: "2"
        //  * output_class: "output_1"
        //  * output_id: "1"
      });

      // const html = document.createElement('div');
      // html.innerHTML = 'Hello Drawflow!!';
      // const data = { name: '' };
      // this.flowchart.registerNode('test', html, null, null);
      // this.flowchart.registerNode('test2', html, null, null);
      // // Use
      // this.flowchart.addNode('github', 0, 1, 150, 300, 'workflow__node', data, 'test', true);

      // this.flowchart.addNode('github', 1, 1, 200, 300, 'workflow__node', data, 'test2', true);
    }
  }

  public onDrop (ev: any) {
    console.log(ev);
    const drawDiv = document.getElementById('drawflowDiv');
    if (drawDiv !== null) {
      const drawDivRect = drawDiv.getBoundingClientRect();

      const x = (ev.event.x - drawDivRect.x) - 50;
      const y = (ev.event.y - drawDivRect.y) - 50;

      const html = document.createElement('div');
      let input: number = 0;
      let output: number = 1;
      let className: string = 'workflow__trigger';
      if (ev.type === 'node') {
        input = 1;
        output = 2;
        className = 'workflow__node';

        let options = '';
        for (const action of this.scriptActions) {
          options += '<option>' + action.name + '</option>';
        }

        html.innerHTML = `<div style="background-color: var(--color-grey4);min-height: 30px;padding: 0 10px;font-weight: bold;border-bottom: 1px solid var(--color-grey8);">
        Node
        </div>
          <div style="min-height: 70px;padding: 0 18px;">
          <!--          <select df-action-type>
            ` + options + `
          </select>
          ` + ev.data + ` -->
          <button df-button>click!</button>
          </div>`;
      } else if (ev.type === 'action') {
        input = 1;
        output = 2;
        className = 'workflow__action';

        let options = '';
        for (const action of this.scriptActions) {
          options += '<option>' + action.name + '</option>';
        }

        html.innerHTML = `<div style="background-color: var(--brown4);min-height: 30px;padding: 0 10px;font-weight: bold;border-bottom: 1px solid var(--brown11);">
        Action
        </div>
          <div style="min-height: 70px;padding: 0 18px;">
          <!--          <select df-action-type>
            ` + options + `
          </select>
          ` + ev.data + ` -->
          <button df-button>click!</button>
          </div>`;
      } else {
        html.innerHTML = `<div style="background-color: var(--sky11);color: #fff;min-height: 30px;padding: 0 10px;font-weight: bold;border-bottom: 2px solid var(--sky11);">
        Trigger
        </div>
          <div style="min-height: 40px;padding: 0 18px;">
          ` + ev.data + `
          </div>`;
      }

      const data = { name: '' };
      this.flowchart.registerNode('test', html, null, null);
      this.flowchart.addNode('github', input, output, x, y, className, data, 'test', true);
    }
  }

  // private initDrawFlow (el: HTMLElement): void {
  //   try {
  //     if (!el) {
  //       this.editor = new Drawflow(el);
  //       this.editor.reroute = true;
  //       this.editor.editor_mode = 'edit';
  //       // this.editor.drawflow = {}
  //       this.editor.start();
  //     } else {
  //       console.error('Drawflow host element does not exist');
  //     }
  //   } catch (exception) {
  //     console.error('Unable to start Drawflow', exception);
  //   }
  // }

  // public ngAfterViewInit () {
  //   const id = document.getElementById('drawflow');
  //   if (id !== null) {
  //     const editor = new Drawflow(id);
  //     console.log(editor);
  //     editor.start();
  //   }
  // }

  public clickMe (ev: Event) {
    console.log(ev);
  }
}
