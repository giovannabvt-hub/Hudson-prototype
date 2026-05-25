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

    setMarkers({ data, ringColor, ringMaxRadius, ringPropagationSpeed, ringRepeatPeriod, pointColor }) {
      // Pulsing rings
      globe.ringsData(data)
        .ringLat('lat').ringLng('lng')
        .ringColor(ringColor)
        .ringMaxRadius(ringMaxRadius)
        .ringPropagationSpeed(ringPropagationSpeed)
        .ringRepeatPeriod(ringRepeatPeriod)
        .ringAltitude(0.005);
    },

    // Use htmlElementsData to render real DOM labels on the globe
    // These are actual HTML elements the user can see, hover, and click
    setHtmlLabels({ data, createElement, onHover, onClick }) {
      globe.htmlElementsData(data)
        .htmlLat('lat')
        .htmlLng('lng')
        .htmlAltitude(0.002)
        .htmlElement(d => {
          const wrapper = createElement(d);
          wrapper.addEventListener('click', (e) => {
            e.stopPropagation();
            if (onClick) onClick(d);
          });
          wrapper.addEventListener('mouseenter', () => {
            if (onHover) onHover(d, wrapper);
          });
          wrapper.addEventListener('mouseleave', () => {
            if (onHover) onHover(null, null);
          });
          return wrapper;
        });
    },

    setRotate(b) { globe.controls().autoRotate = b; },
  };
}
