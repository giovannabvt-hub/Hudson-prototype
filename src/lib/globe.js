// Globe wrapper around globe.gl + topojson-client. Imperative — exposes init() + refresh().
import Globe from 'globe.gl';
import * as topojson from 'topojson-client';

let globe = null;

export function init({ el, onPolygonHover, onPolygonClick, onPointHover, onPointClick, onLabelClick }) {
  globe = Globe()(el)
    .width(el.clientWidth)
    .height(el.clientHeight)
    .backgroundColor('#0A0E0B')
    .showAtmosphere(true)
    .atmosphereColor('#8B6842')
    .atmosphereAltitude(0.20)
    .pointOfView({ lat: 26, lng: 8, altitude: 2.4 });

  globe.globeMaterial().color.set('#1a2a1f');
  globe.controls().autoRotate = true;
  globe.controls().autoRotateSpeed = 0.42;
  globe.controls().enableDamping = true;

  window.addEventListener('resize', () => globe.width(el.clientWidth).height(el.clientHeight));

  fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
    .then(r => r.json())
    .then(world => {
      const features = topojson.feature(world, world.objects.countries).features;
      globe.polygonsData(features)
        .polygonSideColor(() => 'rgba(15,61,46,0.15)')
        .polygonStrokeColor(() => 'rgba(30,127,92,0.18)')
        .polygonAltitude(0.005)
        .onPolygonHover(onPolygonHover)
        .onPolygonClick(onPolygonClick);
    });

  return {
    setCapColor(fn) { globe.polygonCapColor(d => fn(d.properties.name)); },
    setMarkers({ data, ringColor, ringMaxRadius, ringPropagationSpeed, ringRepeatPeriod, pointColor, pointRadius, onPointHover, onPointClick }) {
      globe.ringsData(data)
        .ringLat('lat').ringLng('lng')
        .ringColor(ringColor)
        .ringMaxRadius(ringMaxRadius)
        .ringPropagationSpeed(ringPropagationSpeed)
        .ringRepeatPeriod(ringRepeatPeriod)
        .ringAltitude(0.005);
      globe.pointsData(data)
        .pointLat('lat').pointLng('lng')
        .pointColor(pointColor)
        .pointAltitude(0.025)
        .pointRadius(pointRadius)
        .pointResolution(12)
        .onPointHover(onPointHover || (() => {}))
        .onPointClick(onPointClick || (() => {}));
    },
    setLabels({ data, onLabelClick, onLabelHover }) {
      globe.labelsData(data)
        .labelLat('lat').labelLng('lng')
        .labelText('title')
        .labelSize(d => d.category === 'event' ? 0.9 : 0.75)
        .labelDotRadius(0.45)
        .labelColor(d => d.category === 'event' ? () => 'rgba(184,134,11,0.92)' : () => 'rgba(139,104,66,0.88)')
        .labelDotOrientation(() => 'bottom')
        .labelResolution(3)
        .labelAltitude(0.022)
        .onLabelClick(onLabelClick || (() => {}))
        .onLabelHover(onLabelHover || (() => {}));
    },
    setRotate(b) { globe.controls().autoRotate = b; },
  };
}
