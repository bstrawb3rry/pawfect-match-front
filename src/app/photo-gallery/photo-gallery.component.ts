import {ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-photo-gallery',
  templateUrl: './photo-gallery.component.html',
  styleUrls: ['./photo-gallery.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PhotoGalleryComponent implements OnInit {

  @Input() imageIds: string[] = [];
  @Input() petName: string = "";
  @Input() indicators = true;
  @Input() controls = true;

  currentImageSrc: string = ""; //should put a default image - non found img or something 
  selectedIndex = 0;

  ngOnInit(): void {
    //call backend to retrieve first image to display
    // currentImageSrc = image retrieved from bindCallback;
  }

  selectImage(index: number): void {
    this.selectedIndex = index;
  }

//todo onPrevClick and onNextClick should also call backend and get image to display and set imageSrc
//images[] should contain only imageAlt and imageId due to performance
//maybe we will need to detect changes on images[] in order for the HTML to see the newly retrieved image

  onPrevClick(): void {
    if (this.selectedIndex === 0) {
      this.selectedIndex = this.imageIds.length - 1;
    } else {
      this.selectedIndex--;
    }
    //get from back image for selected index: get image id for selected index and retrieve image
  }

  onNextClick(): void {
    if (this.selectedIndex === this.imageIds.length - 1) {
      this.selectedIndex = 0;
    } else {
      this.selectedIndex++;
    }
    //get from back image for selected index: get image id for selected index and retrieve image
  }

}
