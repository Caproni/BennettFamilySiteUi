import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  TemplateRef,
  OnInit,
  HostListener,
  Input,
  Output,
  ViewChild,
  ChangeDetectorRef,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import ForceGraph2D, {ForceGraphInstance} from 'force-graph';
import { forceManyBody } from 'd3';
import { takeWhile } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

import { FamilyTreePerson } from 'src/app/_models/family-tree/family-tree-person';
import { FamilyTreeDataSource } from 'src/app/_models/family-tree/family-tree-data-source';
import { FamilyTreeRelationship } from 'src/app/_models/family-tree/family-tree-relationship';
import { LoginService } from 'src/app/_services/login/login.service';
import { FamilyTreePersonImageDeleteService } from 'src/app/_services/api/family-tree/family-tree-person/family-tree-person-image-delete.service';
import { FamilyTreePersonImagePutService } from 'src/app/_services/api/family-tree/family-tree-person/family-tree-person-image-put.service';
import { FamilyTreePersonUpdateService } from 'src/app/_services/api/family-tree/family-tree-person/family-tree-person-update.service';


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
  id: string,
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

  isActive = true;

  allowedMimeTypes = ['image/png', 'image/jpeg'];

  photoFile = new File([], '');

  @ViewChild('editPersonTemplate') editPersonTemplate!: TemplateRef<any>;
  @ViewChild('editRelationshipTemplate') editRelationshipTemplate!: TemplateRef<any>;

  modalRef: BsModalRef = new BsModalRef();

  selectedPerson: FamilyTreePerson | undefined;
  selectedLink: FamilyTreeRelationship | undefined;

  editPersonForm: FormGroup = new FormGroup({
    first_name: new FormControl(''),
    middle_names: new FormControl(''),
    chosen_name: new FormControl(''),
    surname: new FormControl(''),
    previous_surnames: new FormControl(''),
    title: new FormControl(''),
    birthplace: new FormControl(''),
    sex: new FormControl(''),
    date_of_birth: new FormControl(''),
    date_of_death: new FormControl(''),
    narrative: new FormControl(''),
  });

  editRelationshipForm: FormGroup = new FormGroup({
    person_one: new FormControl(''),
    person_two: new FormControl(''),
    start_date: new FormControl(''),
    end_date: new FormControl(''),
    relationship_type: new FormControl(''),
    narrative: new FormControl(''),
  });

  personImageForm: FormGroup = new FormGroup({
    image: new FormControl('', [Validators.required]),
  });

  constructor (
    private elementRef: ElementRef,
    private modalService: BsModalService,
    private toasterService: ToastrService,
    private loginService: LoginService,
    private changeDetectorRef: ChangeDetectorRef,
    private familyTreePersonUpdateService: FamilyTreePersonUpdateService,
    private familyTreePersonImagePutService: FamilyTreePersonImagePutService,
    private familyTreePersonImageDeleteService: FamilyTreePersonImageDeleteService,
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
        name: (person?.chosen_name && person.chosen_name != '' ? person.chosen_name : person.first_name) + ' ' + person.surname + (dob ? ' (' + new Date(dob).toLocaleDateString('en-GB') + ')' : ''),
        sex: person.sex ?? '',
        title: person.title ?? '',
        birthplace: person.birthplace ?? '',
        imagePath: person.blob_url ?? '/assets/silhouette.png',
      });
    }

    for (let relationship of this.relationships) {

      if (!relationship.id) continue;

      this.links.push({
        id: relationship.id,
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

  openModal(template: TemplateRef<any>): void {
    this.modalRef = this.modalService.show(template);
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
    this.graph.d3Force('charge', forceManyBody().distanceMax(200).strength(-300));
    this.graph.onNodeRightClick(
      (node) => {
        this.selectedPerson = this.people.filter(item => item.id === node.id)[0];
        this.populateEditPersonForm();
        this.openModal(this.editPersonTemplate);
      }
    );
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
    this.graph.onLinkRightClick(
      //@ts-ignore
      ({source, target, id}) => {
        this.selectedLink = this.relationships.filter(item => item.id === id)[0];
        this.populateEditRelationshipForm();
        this.openModal(this.editRelationshipTemplate);
      }
    );
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

  populateEditPersonForm() {

    if (!this.selectedPerson) return;

    this.editPersonForm.controls['first_name'].setValue(this.selectedPerson.first_name);
    this.editPersonForm.controls['middle_names'].setValue(this.selectedPerson.middle_names);
    this.editPersonForm.controls['chosen_name'].setValue(this.selectedPerson.chosen_name);
    this.editPersonForm.controls['surname'].setValue(this.selectedPerson.surname);
    this.editPersonForm.controls['previous_surnames'].setValue(this.selectedPerson.previous_surnames);
    this.editPersonForm.controls['title'].setValue(this.selectedPerson.title);
    this.editPersonForm.controls['birthplace'].setValue(this.selectedPerson.birthplace);
    this.editPersonForm.controls['sex'].setValue(this.selectedPerson.sex);
    this.editPersonForm.controls['date_of_birth'].setValue(this.selectedPerson.date_of_birth ? new Date(this.selectedPerson.date_of_birth) : '');
    this.editPersonForm.controls['date_of_death'].setValue(this.selectedPerson.date_of_death ? new Date(this.selectedPerson.date_of_death) : '');
    this.editPersonForm.controls['narrative'].setValue(this.selectedPerson.narrative);
  }

  populateEditRelationshipForm() {

    if (!this.selectedLink) return;

    const p1 = this.people.filter(item => this.selectedLink?.person_one === item.id)[0];
    if (!p1.id) return;
    const p1_name = p1.first_name + ' ' + p1.surname + ' ' + p1.date_of_birth ? new Date(p1.date_of_birth ?? '').toLocaleDateString() : '';

    const p2 = this.people.filter(item => this.selectedLink?.person_two === item.id)[0];
    if (!p2.id) return;
    const p2_name = p2.first_name + ' ' + p2.surname + ' ' + new Date(p2.date_of_birth ?? '').toLocaleDateString();

    this.editRelationshipForm.controls['person_one'].setValue(p1_name);
    this.editRelationshipForm.controls['person_two'].setValue(p2_name);
    this.editRelationshipForm.controls['start_date'].setValue(this.selectedLink.start_date ? new Date(this.selectedLink.start_date) : '');
    this.editRelationshipForm.controls['end_date'].setValue(this.selectedLink.end_date ? new Date(this.selectedLink.end_date) : '');
    this.editRelationshipForm.controls['relationship_type'].setValue(this.selectedLink.relationship_type);
    this.editRelationshipForm.controls['narrative'].setValue(this.selectedLink.narrative);
  }

  getSelectedName(): string | undefined {
    if (!this.selectedPerson) return;
    return (this.selectedPerson?.chosen_name && this.selectedPerson.chosen_name != '' ? this.selectedPerson.chosen_name : this.selectedPerson.first_name) + ' ' + this.selectedPerson.surname;
  }

  onEditPersonFormSubmit() {

    if (!this.loginService.checkModalAuthorised(this.modalRef)) return;

    const payload = JSON.parse(JSON.stringify(this.editPersonForm.value));

    if (!this.selectedPerson?.id) return;

    const patch: FamilyTreePerson = {
      first_name: payload.first_name ?? null,
      middle_names: payload.middle_names ?? null,
      chosen_name: payload.chosen_name ?? null,
      surname: payload.surname ?? null,
      previous_surnames: payload.previous_surnames ?? null,
      title: payload.title ?? null,
      birthplace: payload.birthplace ?? null,
      sex: payload.sex ?? null,
      relationships: this.selectedPerson.relationships,
      narrative: payload.narrative ?? null,
      date_of_birth: payload.date_of_birth ? new Date(payload.date_of_birth) : null,
      date_of_death: payload.date_of_death ? new Date(payload.date_of_death) : null,
      blob_url: this.selectedPerson.blob_url,
      facts: this.selectedPerson.facts,
      photos: this.selectedPerson.photos,
      sources: this.selectedPerson.sources,
      id: this.selectedPerson.id,
    };

    this.familyTreePersonUpdateService.updateFamilyTreePerson(
      this.selectedPerson.id,
      patch,
    )
      .pipe(takeWhile(_ => this.isActive))
      .subscribe(
        (_) => {
          this.toasterService.info('Updating ' + this.getSelectedName(), 'Info');
        },
        (_) => {
          this.toasterService.error('Error updating ' + this.getSelectedName(), 'Error');
        },
        () => {
          this.toasterService.success('Updated ' + this.getSelectedName(), 'Success');
          this.changeDetectorRef.detectChanges();
        }
      );

    this.modalRef.hide();

  }

  onPersonImageFormSubmit() {

    if (!this.loginService.checkModalAuthorised(this.modalRef)) return;

    if (!this.selectedPerson?.id) return;

    this.familyTreePersonImagePutService.putFamilyTreePersonImage(
      this.selectedPerson.id,
      this.photoFile,
    )
      .pipe(takeWhile(_ => this.isActive))
      .subscribe(
        (_) => {
          this.toasterService.info('Adding image for ' + this.getSelectedName(), 'Info');
        },
        (_) => {
          this.toasterService.error('Could not add image for ' + this.getSelectedName(), 'Error');
        },
        () => {
          this.toasterService.success('Added image for ' + this.getSelectedName(), 'Success');
          this.changeDetectorRef.detectChanges();
        },
      );

    this.modalRef.hide();
  }

  onPersonImageSelected(event: any) {

    const target = event.target as HTMLInputElement;

    if (!target.files) return;

    const file: File = target.files && target.files[0];

    if (!file) return;

    if (this.allowedMimeTypes.includes(file.type)) {
      this.photoFile = file;
      const image = new Image();
      image.src = URL.createObjectURL(file);
      this.personImageForm.controls['image'].setValue(file.name);
    } else {
      console.log('Invalid file: ', file);
    }

  }

  onDeletePersonImage() {

    if (!this.loginService.checkModalAuthorised(this.modalRef)) return;

    if (!this.selectedPerson?.id) return;

    if (this.selectedPerson.id) {
      this.familyTreePersonImageDeleteService.deleteFamilyTreePersonImage(
        this.selectedPerson.id,
      )
        .pipe(takeWhile(_ => this.isActive))
        .subscribe(
          (_) => {
            this.toasterService.info('Deleting image for ' + this.getSelectedName(), 'Info');
          },
          (_) => {
            this.toasterService.error('Could not delete image for ' + this.getSelectedName(), 'Error');
          },
          () => {
            this.toasterService.success('Deleted image for ' + this.getSelectedName(), 'Success');
          },
        );
      this.modalRef.hide();
    }

  }

  onRelationshipFormSubmit() {

  }

}
