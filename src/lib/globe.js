// Globe wrapper around globe.gl + topojson-client. Imperative — exposes init() + refresh().
import Globe from 'globe.gl';
import * as topojson from 'topojson-client';

let globe = null;

export function init({ el, onPolygonHover, onPolygonClick, onPointHover, onPointClick }) {
  globe = Globe()(el)
    .width(el.clientWidth)
    .height(el.clientHeight)
    .backgroundColor('#0f0d08')
    .showAtmosphere(true)
    .atmosphereColor('#c9a84c')
    .atmosphereAltitude(0.18)
    .pointOfView({ lat: 26, lng: 8, altitude: 2.4 });

  globe.globeMaterial().color.set('#2a1f12');
  globe.controls().autoRotate = true;
  globe.controls().autoRotateSpeed = 0.42;
  globe.controls().enableDamping = true;

  window.addEventListener('resize', () => globe.width(el.clientWidth).height(el.clientHeight));

  fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
    .then(r => r.json())
    .then(world => {
      const features = topojson.feature(world, world.objects.countries).features;
      globe.polygonsData(features)
        .polygonSideColor(() => 'rgba(42,31,18,0.15)')
        .polygonStrokeColor(() => 'rgba(201,168,76,0.14)')
        .polygonAltitude(0.005)
        .onPolygonHover(onPolygonHover)
        .onPolygonClick(onPolygonClick);
    });

  return {
    setCapColor(fn) { globe.polygonCapColor(d => fn(d.properties.name)); },
    setMarkers({ data, ringColor, ringMaxRadius, ringPropagationSpeed, ringRepeatPeriod, pointColor, pointRadius }) {
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
        .pointAltitude(0.014)
        .pointRadius(pointRadius)
        .pointResolution(10)
        .onPointHover(onPointHover)
        .onPointClick(onPointClick);
    },
    setRotate(b) { globe.controls().autoRotate = b; },
  };
}
