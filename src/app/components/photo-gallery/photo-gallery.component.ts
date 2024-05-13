import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { PetService } from 'src/app/services/pet.service';

@Component({
  selector: 'app-photo-gallery',
  templateUrl: './photo-gallery.component.html',
  styleUrls: ['./photo-gallery.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class PhotoGalleryComponent implements OnInit {

  @Input() imageIds: number[] = [];
  @Input() petName: string = "";
  @Input() indicators = true;
  @Input() controls = true;

  currentImageSrc: string = ""; //should put a default image - non found img or something 
  selectedIndex = 0;

  constructor(
    private petService: PetService,
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    var firstImgId = this.imageIds.at(this.selectedIndex);
    if (firstImgId) {
      this.currentImageSrc = this.petService.getPetImageUrl(firstImgId);
      this.changeDetectorRef.detectChanges();
    }
  }

  selectImage(index: number): void {
    this.selectedIndex = index;
  }

  onPrevClick(): void {
    if (this.selectedIndex === 0) {
      this.selectedIndex = this.imageIds.length - 1;
    } else {
      this.selectedIndex--;
    }

    var imgId = this.imageIds.at(this.selectedIndex);
    if (imgId) {
      this.currentImageSrc = this.petService.getPetImageUrl(imgId);
      this.changeDetectorRef.detectChanges();
    }
  }

  onNextClick(): void {
    if (this.selectedIndex === this.imageIds.length - 1) {
      this.selectedIndex = 0;
    } else {
      this.selectedIndex++;
    }
    
    var imgId = this.imageIds.at(this.selectedIndex);
    if (imgId) {
      this.currentImageSrc = this.petService.getPetImageUrl(imgId);
      this.changeDetectorRef.detectChanges();
    }
  }

}
