import { Injectable } from '@angular/core';
import { Component, ViewChild, ElementRef } from '@angular/core';
import jsPDF from 'jspdf';
import { IItem } from '../interfaces/item';
import { el, ro } from 'date-fns/locale';
import { jsPDFConstructor, jsPDFDocument } from 'jspdf-autotable';
import autoTable from 'jspdf-autotable';
import { head } from 'cypress/types/lodash';
import { ngxCsv } from 'ngx-csv';

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
        orientation: 'landscape',
        format: 'A3',
      });
    }
    else{
      doc = new jsPDF({
        format: 'A3',//A voir si on met le format portrait en A3 ou A4
      });
    }
    const pageWidth = doc.internal.pageSize.getWidth();//Largeur de la page
    const pageHeigth = doc.internal.pageSize.getHeight();//Hauteur de la page
    const offsetY = 50; //Permet de centrer à la verticale
    const offsetX = (pageWidth - 67) /2 ;//Permet de centrer à l'horizontale
    doc.setFontSize(18);
    doc.text(`Liste des items : ${internalname}`, margins.left, margins.top );

    doc.setFontSize(15);
    doc.setFont('Times');

    //Tableau qui va correspondre au body
    const data: any[] = [];
    
    const headers = Object.keys(itemsProperties[0])
    itemsProperties.forEach(item => {
      let datarow : any[] = [];
      headers.forEach(header =>{
        datarow.push(item[header]);
      })
      data.push(datarow);
    });
    
    autoTable(doc, {
      head: [headers],
      body: data,
      startY: offsetY,
      styles: {fontSize: 10}
    });
    console.log(data);
    doc.save(`items_${internalname}`);    
  }
}
