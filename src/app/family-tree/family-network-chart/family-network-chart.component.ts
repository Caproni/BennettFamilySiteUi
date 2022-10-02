import { Component, ElementRef, Input, Output, AfterViewInit, HostListener } from '@angular/core';
import ForceGraph, { ForceGraphInstance } from 'force-graph';

import { FamilyTreePerson } from 'src/app/_models/family-tree/family-tree-person';
import { FamilyTreeDataSource } from 'src/app/_models/family-tree/family-tree-data-source';
import { FamilyTreeRelationship } from 'src/app/_models/family-tree/family-tree-relationship';


interface Node {
  id: string,
  img: HTMLImageElement,
  name: string,
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

      this.nodes.push({
        id: person.id,
        name: person.first_name + ' ' + person.surname + ' (' + person.date_of_birth + ')',
        img: img,
      });
    }

    for (let relationship of this.relationships) {
      this.links.push({
        source: relationship.person_one,
        target: relationship.person_two,
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

    this.graph = ForceGraph()(this.htmlElement);
    this.graph.linkColor('#ffffff');
    this.graph.linkLabel('relationship_type')
    this.graph.linkWidth(2);
    // @ts-ignore
    this.graph.nodeCanvasObject(({ img, x, y }, ctx) => {
      const size = 24;
      // @ts-ignore
      ctx.drawImage(img, x - size / 2, y - size / 2, size, size);
    });
    this.graph.nodePointerAreaPaint((node, color, ctx) => {
        const size = 24;
        ctx.fillStyle = color;
      // @ts-ignore
        ctx.fillRect(node.x - size / 2, node.y - size / 2, size, size); // draw square as pointer trap
      });
    this.graph.linkDirectionalParticles(2);
    this.graph.linkDirectionalParticleSpeed(1);
    this.graph.onEngineStop(() => this.graph.zoomToFit(400, 200));
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
