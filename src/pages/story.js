// FolkAble — Story page (About Hudson Records & mission)
let mounted = false;

const TEMPLATE = `
<div class="page-scroll">
  <section class="story-hero">
    <span class="landing-eyebrow">The Story</span>
    <h1 class="story-title">How <span class="t-accent">F</span><span class="t-olk">olk</span><span class="t-accent">Able</span> Came to Be</h1>
    <p class="story-subtitle">Born from a Sheffield record label's belief that folk music thrives when artists lead, communities gather, and creativity comes first.</p>
  </section>

  <section class="story-section">
    <div class="story-block">
      <div class="story-label">Origins</div>
      <h2 class="story-h2">Hudson Records, Sheffield</h2>
      <p>Hudson Records was founded in 2016 in Sheffield, Yorkshire, by passionate advocates for folk music who saw the need for something different: an independent label specialising in folk, indie and world music that put artists at the centre of every decision.</p>
      <p>From their home at The Old Workshop on Ecclesall Road South, Hudson built a roster of extraordinary artists -- Karine Polwart, Emily Portman, Jon Boden, Jenny Sturgeon, Salt House, Seckou Keita, Sam Sweeney, The Furrow Collective, and many more -- united by a shared commitment to authenticity and craft.</p>
    </div>
  </section>

  <section class="story-section story-dark">
    <div class="story-block">
      <div class="story-label">Philosophy</div>
      <h2 class="story-h2">An Artist-Led Ecosystem</h2>
      <p>Hudson Records set out to create an artist-led, sustainable ecosystem that prioritises creativity, community, and ethical business practices. Beyond a traditional label, they built a network encompassing international distribution, artist management, production support, and publishing.</p>
      <p>As Karine Polwart has said of Hudson: "They're more than simply a record company. They're invested in a vibrant ecosystem of collaborative making -- illustrators and designers, filmmakers and podcasters." That spirit of collaborative making became the seed for something larger.</p>
    </div>
  </section>

  <section class="story-section">
    <div class="story-block">
      <div class="story-label">Initiatives</div>
      <h2 class="story-h2">Hudson Club, Presents, and Unearth</h2>
      <p>Hudson grew well beyond releasing records. The Hudson Club, their Bandcamp subscription community, gave listeners a direct line to the artists they love. Hudson Presents brought folk, indie and world music to stages across the UK through a curated concert series. And Hudson Unearth became a launchpad for emerging talent -- artists like Anna McLuckie and Birdvox who went on to release acclaimed albums like The Little Winters and Shamming The Drama.</p>
      <p>Each initiative reinforced the same principle: folk music is not a product to be consumed, but a living tradition to be sustained. This conviction -- that the community around the music matters as much as the music itself -- led Hudson to imagine a platform where that community could truly gather.</p>
    </div>
  </section>

  <section class="story-section story-dark">
    <div class="story-block">
      <div class="story-label">The Platform</div>
      <h2 class="story-h2">From Sheffield to the World</h2>
      <p>FolkAble grew from Hudson's vision of connecting folk communities across borders. If a label in Sheffield could bring together artists from the Scottish Highlands, West Africa, and Scandinavia under one roof, why not extend that model to the entire global folk world?</p>
      <div class="story-principles">
        <div class="story-principle">
          <div class="sp-num">01</div>
          <h3>Artist Sovereignty</h3>
          <p>Every creator controls their own page, their own story, and their own relationship with supporters. No intermediary takes a cut of that connection.</p>
        </div>
        <div class="story-principle">
          <div class="sp-num">02</div>
          <h3>Collective Governance</h3>
          <p>Budget allocation, event approval, new member onboarding -- every significant decision goes through a transparent voting process at the Round Table.</p>
        </div>
        <div class="story-principle">
          <div class="sp-num">03</div>
          <h3>Cultural Preservation</h3>
          <p>Folk music is intangible heritage. FolkAble ensures that traditional knowledge, recordings, and community memory are preserved and accessible.</p>
        </div>
      </div>
    </div>
  </section>

  <section class="story-section">
    <div class="story-block">
      <div class="story-label">The Network</div>
      <h2 class="story-h2">7 Labels, 18 Countries, One Community</h2>
      <div class="story-network">
        <div class="sn-item"><span class="sn-emoji">⚜</span><strong>Hudson Records</strong><span>Sheffield, Yorkshire · Est. 2016</span></div>
        <div class="sn-item"><span class="sn-emoji">⚜</span><strong>Sruth Records</strong><span>Galway, Ireland · Est. 2020</span></div>
        <div class="sn-item"><span class="sn-emoji">⚜</span><strong>Casa do Fado</strong><span>Lisbon, Portugal · Est. 2019</span></div>
        <div class="sn-item"><span class="sn-emoji">⚜</span><strong>Vestland Folk</strong><span>Bergen, Norway · Est. 2017</span></div>
        <div class="sn-item"><span class="sn-emoji">⚜</span><strong>Hollow Holler Records</strong><span>Asheville, NC · Est. 2021</span></div>
        <div class="sn-item"><span class="sn-emoji">⚜</span><strong>Pampa Folk</strong><span>Buenos Aires, Argentina · Est. 2020</span></div>
        <div class="sn-item"><span class="sn-emoji">⚜</span><strong>Eastern Routes</strong><span>Marrakech / Tokyo · Est. 2019</span></div>
      </div>
    </div>
  </section>

  <section class="story-section story-dark">
    <div class="story-block" style="text-align:center;">
      <div class="story-label">Join Us</div>
      <h2 class="story-h2">This Is Just the Beginning</h2>
      <p>FolkAble is a living platform -- shaped by its members, responsive to its community, and always evolving. Whether you play, produce, listen, or simply love folk music, there is a place for you here.</p>
      <div class="landing-ctas" style="justify-content:center;margin-top:28px;">
        <a class="landing-btn primary" href="#discovery">Explore the Globe</a>
        <a class="landing-btn secondary" href="#artists">Meet the Artists</a>
      </div>
    </div>
  </section>
</div>
`;

export function mount(root) {
  if (mounted) return;
  root.innerHTML = TEMPLATE;
  mounted = true;
}

export function unmount() {}
