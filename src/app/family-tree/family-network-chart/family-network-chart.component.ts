import { Component, ElementRef, Input, Output, AfterViewInit, HostListener } from '@angular/core';
import ForceGraph, { ForceGraphInstance } from 'force-graph';

import { FamilyTreePerson } from 'src/app/_models/family-tree/family-tree-person';
import { FamilyTreeDataSource } from 'src/app/_models/family-tree/family-tree-data-source';
import { FamilyTreeRelationship } from 'src/app/_models/family-tree/family-tree-relationship';


interface Node {
  id: string,
  img: HTMLImageElement,
  name: string,
  sex: string,
  title: string,
  birthplace: string,
}

interface Link {
  source: string,
  target: string,
  relationship_type: string,
  narrative: string,
  start_date: Date | null,
  end_date: Date | null,
}

@Component({
  selector: 'fam-app-family-network-chart',
  templateUrl: './family-network-chart.component.html',
  styleUrls: ['./family-network-chart.component.css']
})
export class FamilyNetworkChartComponent implements AfterViewInit {

  private graph!: ForceGraphInstance;

  @Input() @Output() people: FamilyTreePerson[] = [];
  @Input() @Output() relationships: FamilyTreeRelationship[] = [];
  @Input() @Output() dataSources: FamilyTreeDataSource[] = [];

  nodes: Node[] = [];
  links: Link[] = [];

  isActive = true;

  constructor(
    private elementRef: ElementRef,
  ) { }

  ngAfterViewInit(): void {

    for (let person of this.people) {

      if (!person.id) continue;

      const img = new Image();
      img.src = person.blob_url ?? '/assets/silhouette.png';

      const dob = person.date_of_birth;

      this.nodes.push({
        id: person.id,
        name: person.first_name + ' ' + person.surname + (dob ? ' (' + new Date(dob).toLocaleDateString('en-GB') + ')' : ''),
        sex: person.sex ?? '',
        title: person.title ?? '',
        birthplace: person.birthplace ?? '',
        img: img,
      });
    }

    for (let relationship of this.relationships) {
      this.links.push({
        source: relationship.person_two,
        target: relationship.person_one,
        relationship_type: relationship.relationship_type,
        narrative: relationship.narrative ?? '',
        start_date: relationship.start_date ? new Date(relationship.start_date) : null,
        end_date: relationship.end_date ? new Date(relationship.end_date) : null,
      });
    }

    const familyTreeData = {
      nodes: this.nodes,
      links: this.links,
    }

    const size = 24;

    this.graph = ForceGraph()(this.htmlElement);
    this.graph.linkColor('#ffffff');
    this.graph.linkLabel('relationship_type')
    this.graph.linkWidth(2);
    // this.graph.nodePointerAreaPaint(
    //   ({ id, x, y }, color, ctx) => {
    //     // @ts-ignore
    //     ctx.beginPath(); ctx.arc(x, y, 5, 0, 2 * Math.PI, false);
    //   }
    // );
    // @ts-ignore
    this.graph.nodeCanvasObject(({ img, x, y }, ctx) => {
      // @ts-ignore
      ctx.drawImage(img, x - size / 2, y - size / 2, size, size);
    });
    this.graph.linkDirectionalArrowLength((link) => {
      // @ts-ignore
      return link.relationship_type === 'Child'? 6 : 0;
    });
    this.graph.linkCanvasObject((link, ctx) => {
      const MAX_FONT_SIZE = 4;
      const LABEL_NODE_MARGIN = this.graph.nodeRelSize() * 1.5;

      const start = link.source;
      const end = link.target;

      // ignore unbound links
      if (typeof start !== 'object' || typeof end !== 'object') return;

      // calculate label positioning
      // @ts-ignore
      const textPos = Object.assign(...['x', 'y'].map(c => ({
      // @ts-ignore
        [c]: start[c] + (end[c] - start[c]) / 2 // calc middle point
      })));

      // @ts-ignore
      const relLink = { x: end.x - start.x, y: end.y - start.y };

      const maxTextLength = Math.sqrt(Math.pow(relLink.x, 2) + Math.pow(relLink.y, 2)) - LABEL_NODE_MARGIN * 2;

      let textAngle = Math.atan2(relLink.y, relLink.x);
      // maintain label vertical orientation for legibility
      if (textAngle > Math.PI / 2) textAngle = -(Math.PI - textAngle);
      if (textAngle < -Math.PI / 2) textAngle = -(-Math.PI - textAngle);

      // @ts-ignore
      const label = `${link.relationship_type}`;

      // estimate fontSize to fit in link length
      ctx.font = '1px Sans-Serif';
      const fontSize = Math.min(MAX_FONT_SIZE, maxTextLength / ctx.measureText(label).width);
      ctx.font = `${fontSize}px Sans-Serif`;
      const textWidth = ctx.measureText(label).width;
      const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2); // some padding

      // draw text label (with background rect)
      ctx.save();
      ctx.translate(textPos['x'], textPos['y']);
      ctx.rotate(textAngle);

      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      // @ts-ignore
      ctx.fillRect(- bckgDimensions[0] / 2, - bckgDimensions[1] / 2, ...bckgDimensions);

      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = 'darkgrey';
      ctx.fillText(label, 0, 0);
      ctx.restore();
    });
    this.graph.graphData(familyTreeData);

    this.windowResize();
  }

  private get htmlElement(): HTMLElement {
    return this.elementRef.nativeElement;
  }

  @HostListener("window:resize")
  public windowResize(): void {
    const box = this.htmlElement.getBoundingClientRect();
    this.graph?.width(box.width);
    this.graph?.height(box.height);
  }

}
