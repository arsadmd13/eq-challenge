import { Component, OnInit, ViewChild } from '@angular/core';
import { GoogleMap } from '@angular/google-maps';
import { PoiService } from '../utils/services/poi/poi.service';
// import MarkerClusterer, { MarkerClustererOptions } from '@googlemaps/markerclustererplus'
import * as L from 'leaflet';
import 'leaflet.markercluster';
import { FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

declare var MarkerClusterer:any;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

  constructor(private poiService: PoiService,
              private httpClient: HttpClient) { }

  private leaflet_map: any;
  private gapiLoaded: any;

  @ViewChild('GoogleMap', { static: false })
  map!: any;

  mapType = new FormControl('lm');

  google_map_zoom = 2
  google_map_center: google.maps.LatLngLiteral = {
    lat: 29.8282,
    lng: -98.5795
  };
  google_map_options: google.maps.MapOptions = {
    minZoom: 2
  }

  google_map_markers: any = [];

  markerClustererImagePath =
      'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m';

  ngOnInit(): void {
    // this.gapiLoaded = this.httpClient
    //   .jsonp(
    //     'https://maps.googleapis.com/maps/api/js?key=' +
    //     'AIzaSyD5OAzgE_d9feZrX4U5GMwUwfkhXKlqYKQ',
    //     'callback'
    //   ).subscribe(
    //     (res: any) => {},
    //     (err: any) => {console.log(err)}
    //   )
      
      // .pipe(
      //   map(() => true),
      //   catchError(err => {
      //     return of(false);
      //   })
      // );
    this.fetchLocations();
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  private initMap(): void {
    this.leaflet_map = L.map('map', {
      center: [ 29.8282, -98.5795 ],
      zoom: 2
    });

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      minZoom: 2,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    tiles.addTo(this.leaflet_map);
  }

  fetchLocations() {
    let leaflet_marker_cluster = L.markerClusterGroup();
    this.poiService.poiWithEvents().subscribe(
      (res: any) => {
        res.forEach((data: any) => {
          // Google Map Marker
          let marker: any = {
            position: {
              lat: data.lat,
              lng: data.lon
            },
            label: {
              color: 'white',
              text: data.name
            },
            title: data.name,
            icon: this.getIcon(data.name)
          }
          this.google_map_markers.push(marker);
          // Leaflet Marker
          let leaflet_marker = L.marker([data.lat, data.lon], {
            icon: L.icon({
              iconUrl: 'assets/marker-icon.png',
              shadowUrl: 'assets/marker-shadow.png'
            })
          });
          leaflet_marker.bindPopup(
            "<b>" + data.name + "</b>" +
            "<br>Events: " + data.events +
            "<br>Revenue: " + Number(data.revenue).toFixed(2)
          );
          leaflet_marker_cluster.addLayer(leaflet_marker);
        })
        leaflet_marker_cluster.addTo(this.leaflet_map)
      }, (err: any) => {
        console.log(err)
      }
    )
  }

  getIcon(loc: string) {
    if(loc.toLocaleLowerCase() === "eq works") {
      return {
        labelOrigin: { x: 16, y: 48 },
        url: 'https://enigmatic-falls-61120.000webhostapp.com/eql.png'
      }
    } 
    return {
      labelOrigin: { x: 16, y: 48 },
      url: 'https://enigmatic-falls-61120.000webhostapp.com/m3.png'
    };
  }

  // ngOnDestroy() {
  //   document.getElementsByTagName('google-map')[0].remove();
  // }

}
