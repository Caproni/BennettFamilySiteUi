import {ChangeDetectionStrategy, Component, ElementRef, HostListener, Input, OnInit, Output} from '@angular/core';
import ForceGraph2D, {ForceGraphInstance} from 'force-graph';
import {forceManyBody} from 'd3';

import {FamilyTreePerson} from 'src/app/_models/family-tree/family-tree-person';
import {FamilyTreeDataSource} from 'src/app/_models/family-tree/family-tree-data-source';
import {FamilyTreeRelationship} from 'src/app/_models/family-tree/family-tree-relationship';


interface Node {
  id: string,
  imagePath: string,
  image?: HTMLImageElement,
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
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './family-network-chart.component.html',
  styleUrls: ['./family-network-chart.component.scss']
})
export class FamilyNetworkChartComponent implements OnInit {

  private graph!: ForceGraphInstance;

  @Input() @Output() people: FamilyTreePerson[] = [];
  @Input() @Output() relationships: FamilyTreeRelationship[] = [];
  @Input() @Output() dataSources: FamilyTreeDataSource[] = [];

  nodes: Node[] = [];
  links: Link[] = [];

  imageCache = new Map<string, HTMLImageElement>();

  isActive = true;

  constructor (
    private elementRef: ElementRef,
  ) { }

  ngOnInit(): void {
    this.initializeGraph();
  }

  async initializeGraph(): Promise<void> {
    await this.preloadData();
    this.createGraph();
  }

  private async preloadData(): Promise<void> {

    for (let person of this.people) {

      if (!person.id) continue;

      const dob = person.date_of_birth;

      this.nodes.push({
        id: person.id,
        name: person.first_name + ' ' + person.surname + (dob ? ' (' + new Date(dob).toLocaleDateString('en-GB') + ')' : ''),
        sex: person.sex ?? '',
        title: person.title ?? '',
        birthplace: person.birthplace ?? '',
        imagePath: person.blob_url ?? '/assets/silhouette.png',
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

    const loadPromises = this.nodes.map((node) => {
      return new Promise<void>((resolve) => {
        const img = new Image();
        img.src = node.imagePath ?? '/assets/silhouette.png';
        img.onload = () => {
          node.image = img; // Assign the loaded image to the node
          resolve();
        };
      });
    });

    await Promise.all(loadPromises);
  }

  private createGraph(): void {

    const familyTreeData = {
      nodes: this.nodes,
      links: this.links,
    }

    const size = 24;

    this.graph = ForceGraph2D()(this.htmlElement);
    this.graph.linkColor('#ffffff');
    this.graph.linkLabel('relationship_type');
    this.graph.linkWidth(4);
    //@ts-ignore
    this.graph.d3Force('charge', forceManyBody().distanceMax(200).strength(-300))
    //@ts-ignore
    this.graph.nodeCanvasObject(({id, image, x, y}, ctx, globalScale) => {

      const node = this.nodes.find((node) => node.id === id);

        if (node && node.image && x && y) {
           const d = size * globalScale;
           ctx.save();
           ctx.beginPath();
           ctx.arc(x, y, d / 2, 0, 2 * Math.PI, false);
           ctx.closePath();
           ctx.clip();
           ctx.drawImage(node.image, x - d / 2, y - d / 2, d, d);
           ctx.restore();

           ctx.beginPath();
           ctx.arc(x, y, size * globalScale / 2, 0, 2 * Math.PI, false);
           ctx.strokeStyle = 'black';
           ctx.lineWidth = 0.25;
           ctx.stroke();
        }
      })
      // @ts-ignore
    this.graph.linkDirectionalArrowLength((link: Link) => {
        return link.relationship_type === 'Child'? 6 : 0;
      })
    this.graph.linkCanvasObject((link, ctx, globalScale) => {
        const MAX_FONT_SIZE = 4 * globalScale;
        const LABEL_NODE_MARGIN = this.graph.nodeRelSize() * globalScale;

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

        if (start.x && start.y && end.x && end.y) {
          const relLink = { x: end.x - start.x, y: end.y - start.y };
          const maxTextLength = globalScale * Math.sqrt(Math.pow(relLink.x, 2) + Math.pow(relLink.y, 2)) - LABEL_NODE_MARGIN * 2;
          let textAngle = Math.atan2(relLink.y, relLink.x);
          // maintain label vertical orientation for legibility
          if (textAngle > Math.PI / 2) textAngle = -(Math.PI - textAngle);
          if (textAngle < -Math.PI / 2) textAngle = -(-Math.PI - textAngle);
          // @ts-ignore
          const label = `${link.relationship_type}`;

          // estimate fontSize to fit in link length
          ctx.font = '1px Sans-Serif';
          const fontSize = Math.min(MAX_FONT_SIZE, maxTextLength / ctx.measureText(label).width * globalScale);
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
        }

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
