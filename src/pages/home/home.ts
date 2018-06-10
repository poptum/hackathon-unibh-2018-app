import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Socket } from 'ng-socket-io';
import { Observable } from 'rxjs/Observable';
import { Geolocation } from '@ionic-native/geolocation';
import { Storage } from '@ionic/storage';
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  ocorrencia: boolean = false;
  tipooc: any;

  constructor(public navCtrl: NavController, private socket: Socket, private geolocation: Geolocation, private storage: Storage) {

    this.getAgentes().subscribe(message => {
      this.geolocation.getCurrentPosition().then((resp) => {
        this.socket.emit('localizacao', { lat: resp.coords.latitude, lng: resp.coords.longitude, ocorrencia: this.tipooc});
        // resp.coords.latitude
        // resp.coords.longitude
      }).catch((error) => {
        console.log('Error getting location', error);
      });
    });

  }
  ionViewDidLoad() {
    this.socket.connect();

    this.storage.get('tipoOcorrencia').then((val) => {
      if (!val) {
        this.ocorrencia = false
      } else {
        this.ocorrencia = true
      }
    });

  }

  getAgentes() {
    let observable = new Observable(observer => {
      this.socket.on('ocorrencia', (data) => {
        observer.next(data);
      });
    })
    return observable;
  }

  onChangeTipo() {
    this.storage.set('tipoOcorrencia', this.tipooc);
  }

  ngOnDestroy() {
    this.socket.disconnect();
  }

}
