import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { PetService } from 'src/app/services/pet.service';

@Component({
  selector: 'app-photo-gallery',
  templateUrl: './photo-gallery.component.html',
  styleUrls: ['./photo-gallery.component.scss'],
})
export class PhotoGalleryComponent implements OnInit {

  @Input() imageIds: number[] | undefined;
  @Input() petName: string | undefined;
  @Input() distance: number | undefined;
  @Input() indicators = true;
  @Input() controls = true;

  currentImageSrc: string = "";
  selectedIndex = 0;

  constructor(
    private petService: PetService,
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    if (this.imageIds) {
      var firstImgId = this.imageIds.at(this.selectedIndex);
      if (firstImgId) {
        this.currentImageSrc = this.petService.getPetImageUrl(firstImgId);
        this.changeDetectorRef.detectChanges();
      }
    }
  }
  
  onPrevClick(): void {
    if (this.selectedIndex === 0 && this.imageIds) {
      this.selectedIndex = this.imageIds.length - 1;
    } else {
      this.selectedIndex--;
    }

    if (this.imageIds) {
      var imgId = this.imageIds.at(this.selectedIndex);
      if (imgId) {
        this.currentImageSrc = this.petService.getPetImageUrl(imgId);
        this.changeDetectorRef.detectChanges();
      }
    }
  }

  onNextClick(): void {
    if (this.imageIds && this.selectedIndex === this.imageIds.length - 1) {
      this.selectedIndex = 0;
    } else {
      this.selectedIndex++;
    }

    if (this.imageIds) {
      var imgId = this.imageIds.at(this.selectedIndex);
      if (imgId) {
        this.currentImageSrc = this.petService.getPetImageUrl(imgId);
        this.changeDetectorRef.detectChanges();
      }
    }
  }

}
