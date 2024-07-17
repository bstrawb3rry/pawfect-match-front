import { Component, Output, EventEmitter, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-range-slider',
  templateUrl: './range-slider.component.html',
  styleUrls: ['./range-slider.component.scss']
})
export class RangeSliderComponent implements OnInit {

  @Input() minValue: number;
  @Input() maxValue: number;
  @Input() minLabel: string | undefined;
  @Input() maxLabel: string | undefined;
  @Input() label: string | undefined;

  min: number;
  max: number;

  @Output() ageRangeChanged = new EventEmitter<{minValue: number, maxValue: number}>();

  ngOnInit(): void {
    this.min = this.minValue;
    this.max = this.maxValue
  }

  onStartChange(event: any): void {
    this.min = event.target.value;
    this.ageRangeChanged.emit({ minValue: this.min, maxValue: this.max });
  }

  onEndChange(event: any): void {
    this.max = event.target.value;
    this.ageRangeChanged.emit({ minValue: this.min, maxValue: this.max });
  }
}
