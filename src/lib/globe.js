// Globe wrapper around globe.gl + topojson-client
import Globe from 'globe.gl';
import * as topojson from 'topojson-client';

let globe = null;

export function init({ el, onPolygonHover, onPolygonClick, onPointHover, onPointClick }) {
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

    setHotspots({ data, pointColor, onHover, onClick }) {
      // Pulsing rings
      globe.ringsData(data)
        .ringLat('lat').ringLng('lng')
        .ringColor(d => t => {
          const c = d._ringRgb || [139,104,66];
          return `rgba(${c[0]},${c[1]},${c[2]},${(1 - t) * 0.7})`;
        })
        .ringMaxRadius(3)
        .ringPropagationSpeed(2)
        .ringRepeatPeriod(1800)
        .ringAltitude(0.004);

      // Visible, clickable dot
      globe.pointsData(data)
        .pointLat('lat').pointLng('lng')
        .pointColor(pointColor)
        .pointAltitude(0.012)
        .pointRadius(0.35)
        .pointResolution(12)
        .onPointHover(onHover)
        .onPointClick(onClick);

      // Text labels on globe surface
      globe.labelsData(data)
        .labelLat('lat').labelLng('lng')
        .labelText('title')
        .labelSize(0.55)
        .labelDotRadius(0)
        .labelColor(() => () => 'rgba(232,220,200,0.6)')
        .labelDotOrientation(() => 'bottom')
        .labelResolution(3)
        .labelAltitude(0.016)
        .onLabelHover(onHover)
        .onLabelClick(onClick);
    },

    setRotate(b) { globe.controls().autoRotate = b; },
  };
}
