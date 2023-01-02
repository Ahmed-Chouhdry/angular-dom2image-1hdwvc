import { Component, OnInit, ViewChild } from '@angular/core';
import domtoimage from 'dom-to-image';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  @ViewChild('container') container;
  @ViewChild('container1') container1;

  ngOnInit() {}
  getImage() {}

  DonloadImage() {
    domtoimage
      .toPng(this.container.nativeElement)
      .then(function (dataUrl) {
        var img = new Image();
        img.src = dataUrl;
        debugger;
        // document.body.appendChild(img);
        let link = document.createElement('a');
        link.download = 'my-image-name.jpeg';
        link.href = dataUrl || null;
        link.click();
      })
      .catch(function (error) {
        console.error('oops, something went wrong!', error);
      });
  }

  blobToImg(blob) {
    return new Promise((resolve, reject) => {
      let reader = new FileReader();
      reader.addEventListener('load', () => {
        let img = new Image();
        img.src = reader.result;
        img.addEventListener('load', () => resolve(img));
      });
      reader.readAsDataURL(blob);
    });
  }
  imgToCanvas(img) {
    let canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    let ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    return canvas;
  }

  watermark(canvas: HTMLCanvasElement, text) {
    return new Promise((resolve, reject) => {
      let ctx = canvas.getContext('2d');
      // Set fill size and font, style
      ctx.font = '30px Times New Roman';
      ctx.fillStyle = '# FFC82C';
      ctx.globalAlpha = 0.1;
      ctx.rotate((20 * Math.PI) / 180);
      // Set right alignment
      ctx.textAlign = 'center';
      // Draw text at the specified position, here specify the location from the bottom right corner 20 coordinates
      ctx.fillText(text, canvas.width - 20, canvas.height / 2);
      canvas.toBlob((blob) => resolve(blob));
    });
  }

  imgWatermark(text) {
    let me = this;
    domtoimage
      .toPng(this.container.nativeElement)
      .then(async (dataUrl) => {
        const imgFile = new File(
          [me.dataURItoBlob(dataUrl)],
          'MyFileName.png',
          {
            type: 'image/png',
          }
        );
        // var img = new Image();
        // img.src = dataUrl;
        debugger;
        let img1 = await me.blobToImg(imgFile);
        let canvas = me.imgToCanvas(img1);
        let blob = await me.watermark(canvas, text);
        debugger;
        // Here read the blob to the img tag and render it in the dom; if it is an upload file, you can add the blob to FormData
        let newImage = await me.blobToImg(blob);
        document.body.appendChild(newImage);
        // let link = document.createElement('a');
        // link.download = 'my-image-name.jpeg';
        // link.href = dataUrl || null;
        // link.click();
      })
      .catch(function (error) {
        console.error('oops, something went wrong!', error);
      });
    // let me = this;
    // let input = document.createElement('input');
    // input.setAttribute('type', 'file');
    // input.setAttribute('accept', 'image / *');
    // input.onchange = async () => {
    //   debugger;
    //   let img = await me.blobToImg(input.files[0]);
    //   let canvas = me.imgToCanvas(img);
    //   let blob = await me.watermark(canvas, text);
    //   // Here read the blob to the img tag and render it in the dom; if it is an upload file, you can add the blob to FormData
    //   let newImage = await me.blobToImg(blob);
    //   debugger;
    //   document.body.appendChild(newImage);
    //   // this.container1.appendChild(newImage);
    // };
    // input.click();
  }
  dataURItoBlob(dataURI: any) {
    var base64result = dataURI.split(',')[1];
    const byteString = window.atob(base64result);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array], { type: 'image/png' });
    return blob;
  }
}
