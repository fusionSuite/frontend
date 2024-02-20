import { Injectable } from '@angular/core';
import { ngxCsv } from 'ngx-csv';
import { Component, ViewChild, ElementRef } from '@angular/core';
import jsPDF from 'jspdf';
import { IItem } from '../interfaces/item';
import { el } from 'date-fns/locale';

@Injectable({
  providedIn: 'root'
})
export class ExportcsvService {

  constructor() { 

  }


  public saveDataInCSV(data: Array<any>, internalname: string): typeof ngxCsv | null{
    let propertyNameHeader = Object.keys(data[0]);
    if(data.length){
      var options = {
        fieldSeparator: ',',
        quoteStrings:'"',
        decimalseparator: '.',
        showLabels: true,
        title:'Items',
        useBom: true,
        headers: propertyNameHeader,
      }

      new ngxCsv(data, "Items" + internalname, options);

      return ngxCsv;
    }
    return null;
  }
  
  
  public exportToPdf(itemsProperties: any[], internalname: string, landscape: boolean){
    let doc: jsPDF;
    let value:any;
    const margins = {
      top: 30,
      bottom: 30,
      left: 10,
      right: 10,
    }
    if(landscape === true){
      doc = new jsPDF({
        orientation: 'landscape'
      });
    }
    else{
      doc = new jsPDF();
    }
    const pageWidth = doc.internal.pageSize.getWidth();//Largeur de la page
    const pageHeigth = doc.internal.pageSize.getHeight();//Hauteur de la page
    doc.setFontSize(18);
    doc.text(`Liste des items : ${internalname}`, margins.left, margins.top );
    console.log(itemsProperties);

    doc.setFontSize(15);
    doc.setFont('Times');
    itemsProperties.forEach((item, index) => {
      const offsetY = (pageHeigth - 150)/2; //Permet de centrer à la verticale
      const offsetX = (pageWidth - 67) /2 ;//Permet de centrer à l'horizontale
      doc.text(`Item ${index + 1} : ${item.name}`, offsetX, offsetY )

      Object.keys(item).forEach((propertyKey, propertyIndex) =>{
        if(propertyKey !== 'id' && propertyKey !== 'name'){
          value = item[propertyKey];
          doc.text(`${propertyKey}: ${value}`, offsetX, offsetY + (propertyIndex + 1) *8);//Permet de gérer l'espacement de chaque propiété
        }
      });

      if(index < itemsProperties.length - 1){
        doc.addPage();
      }

    });
    doc.save(`items${internalname}`);
  }
}
