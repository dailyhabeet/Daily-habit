import { useState, useEffect, useCallback, useRef, useContext, createContext } from "react";

const THEMES = {
  dark:        { id:"dark",        label:"Dark (Default)",    icon:"🌙", desc:"Classic dark, easy on the eyes at night",          gold:"#C9A84C", sage:"#4A7C59", wine:"#c0392b", bg:"#0a0a16",  surface:"#141428", s2:"rgba(255,255,255,0.05)", border:"rgba(255,255,255,0.09)", text:"#f5f0e8", mid:"#c8c0b0", muted:"#776655", faint:"#443322", hf:"Georgia,serif",             bf:"sans-serif",            fs:1,    lh:1.6,  ls:"normal",  ib:"rgba(0,0,0,0.4)", r:14, rs:8  },
  light:       { id:"light",       label:"Light",             icon:"☀️", desc:"Clean white, great for daytime reading",            gold:"#a07820", sage:"#2e6644", wine:"#c0392b", bg:"#f0ece4",  surface:"#ffffff",  s2:"rgba(0,0,0,0.04)",        border:"rgba(0,0,0,0.12)",      text:"#1a1a1a", mid:"#333",    muted:"#666",   faint:"#999", hf:"Georgia,serif",             bf:"sans-serif",            fs:1,    lh:1.6,  ls:"normal",  ib:"#f8f8f8",         r:14, rs:8  },
  dyslexia:    { id:"dyslexia",    label:"Dyslexia-Friendly", icon:"👁", desc:"Wider spacing and clean font for easier reading",    gold:"#b07800", sage:"#2a6040", wine:"#c0392b", bg:"#fdf6e3",  surface:"#fffbf0",  s2:"rgba(0,0,0,0.03)",        border:"rgba(0,0,0,0.12)",      text:"#2b2000", mid:"#4a3800", muted:"#8a7040",faint:"#b09060",hf:"Arial,sans-serif",            bf:"Arial,sans-serif",      fs:1.08, lh:1.9,  ls:"0.04em",  ib:"#fff8e8",         r:16, rs:10 },
  highContrast:{ id:"highContrast",label:"High Contrast",     icon:"⬛", desc:"Maximum contrast for low vision or bright settings", gold:"#ffcc00", sage:"#00e676", wine:"#ff1744", bg:"#000000",  surface:"#111111",  s2:"rgba(255,255,255,0.07)",  border:"rgba(255,255,255,0.28)", text:"#ffffff", mid:"#eee",    muted:"#aaa",   faint:"#666", hf:"Arial Black,sans-serif",    bf:"Arial,sans-serif",      fs:1.05, lh:1.75, ls:"0.02em",  ib:"#1a1a1a",         r:10, rs:6  },
  sepia:       { id:"sepia",       label:"Sepia / Scripture", icon:"📜", desc:"Warm parchment, a classic manuscript feel",          gold:"#8b6914", sage:"#4a7c3f", wine:"#c0392b", bg:"#f4e8c8",  surface:"#fdf3dc",  s2:"rgba(0,0,0,0.04)",        border:"rgba(139,105,20,0.25)", text:"#2c1a00", mid:"#5c3d10", muted:"#8b6020",faint:"#c4a060",hf:"Palatino Linotype,serif",    bf:"Georgia,serif",         fs:1,    lh:1.7,  ls:"0.01em",  ib:"#f8ecc8",         r:12, rs:7  },
  largePrint:  { id:"largePrint",  label:"Large Print",       icon:"🔍", desc:"Bigger text and generous spacing",                   gold:"#C9A84C", sage:"#4A7C59", wine:"#c0392b", bg:"#0a0a16",  surface:"#141428",  s2:"rgba(255,255,255,0.05)",  border:"rgba(255,255,255,0.09)", text:"#f5f0e8", mid:"#c8c0b0", muted:"#887766",faint:"#554433",hf:"Georgia,serif",             bf:"sans-serif",            fs:1.22, lh:1.9,  ls:"0.02em",  ib:"rgba(0,0,0,0.4)", r:16, rs:10 },
};
const ThemeCtx = createContext(THEMES.dark);
const useT = () => useContext(ThemeCtx);

// ---- Access gate (single shared password for launch) ----
const ACCESS_PASSWORD = "Rooted2026";
const ACCESS_KEY = "dh_access_ok";

function AccessGate({ children }) {
  const [ok, setOk] = useState(() => {
    try { return localStorage.getItem(ACCESS_KEY) === "yes"; } catch { return false; }
  });
  const [entry, setEntry] = useState("");
  const [error, setError] = useState(false);
  if (ok) return children;
  const tryUnlock = () => {
    if (entry.trim() === ACCESS_PASSWORD) {
      try { localStorage.setItem(ACCESS_KEY, "yes"); } catch {}
      setOk(true);
    } else {
      setError(true);
    }
  };
  const T = THEMES.dark;
  return (
    <div style={{ minHeight: "100vh", background: T.bg, display: "flex", justifyContent: "center", alignItems: "center", fontFamily: T.bf, padding: "24px" }}>
      <div style={{ width: "100%", maxWidth: 360, background: T.surface, border: `1px solid ${T.border}`, borderRadius: T.r, padding: "32px 24px", textAlign: "center" }}>
        <div style={{ fontSize: "2.4rem", marginBottom: 6 }}>✝️</div>
        <div style={{ color: T.gold, letterSpacing: 4, fontSize: "0.85rem", marginBottom: 12 }}>✦ ✦ ✦</div>
        <h1 style={{ fontFamily: T.hf, color: T.text, fontSize: "1.6rem", margin: "0 0 6px", lineHeight: 1.2 }}>
          Daily <em style={{ color: T.gold }}>Habit</em>
        </h1>
        <p style={{ color: T.mid, fontSize: "0.85rem", lineHeight: 1.6, margin: "0 0 20px" }}>
          Enter your access code to begin. You'll only need to do this once on this device.
        </p>
        <input
          type="password"
          value={entry}
          onChange={(e) => { setEntry(e.target.value); setError(false); }}
          onKeyDown={(e) => { if (e.key === "Enter") tryUnlock(); }}
          placeholder="Access code"
          style={{ width: "100%", background: T.ib, border: `2px solid ${error ? T.wine : T.border}`, borderRadius: T.rs, color: T.text, padding: "11px 13px", fontSize: "1rem", outline: "none", marginBottom: 10, textAlign: "center" }}
        />
        {error && <div style={{ color: T.wine, fontSize: "0.78rem", marginBottom: 10 }}>That code isn't right. Please check and try again.</div>}
        <button
          onClick={tryUnlock}
          style={{ width: "100%", background: T.gold, color: "#1a1a2e", border: "none", borderRadius: 20, padding: "12px", fontWeight: "bold", fontSize: "0.95rem", cursor: "pointer" }}
        >
          Unlock
        </button>
        <p style={{ color: T.faint, fontSize: "0.7rem", marginTop: 16, lineHeight: 1.5 }}>
          Don't have a code yet? Get access at dailyhabeet.com
        </p>
      </div>
    </div>
  );
}

const DAYS = [
  { day:1, name:"Monday",    theme:"Foundation", a:{ book:"Genesis 1-2",        sub:"The Creation Account",        focus:"God as Creator; your identity as His creation" }, b:{ book:"Psalm 1-3",          sub:"The Blessed Man",            focus:"Meditating on God's word day and night" } },
  { day:2, name:"Tuesday",   theme:"Faith",      a:{ book:"Proverbs 3",         sub:"Trust in the Lord",           focus:"Leaning not on your own understanding" },        b:{ book:"Hebrews 11",         sub:"The Hall of Faith",          focus:"Faith as the substance of things hoped for" } },
  { day:3, name:"Wednesday", theme:"Wisdom",     a:{ book:"James 1",            sub:"Trials, Wisdom and Temptation",focus:"Asking God for wisdom generously given" },      b:{ book:"Proverbs 8-9",       sub:"Wisdom's Call",              focus:"Wisdom as a gift from God at creation" } },
  { day:4, name:"Thursday",  theme:"Courage",    a:{ book:"Joshua 1",           sub:"Be Strong and Courageous",    focus:"God's command to courage despite fear" },       b:{ book:"Daniel 3",           sub:"The Fiery Furnace",           focus:"Standing firm even under extreme pressure" } },
  { day:5, name:"Friday",    theme:"Grace",      a:{ book:"Romans 5-6",         sub:"Justification and Dead to Sin",focus:"God's grace abounding beyond all sin" },       b:{ book:"Ephesians 2",        sub:"Made Alive in Christ",        focus:"Saved by grace through faith, not works" } },
  { day:6, name:"Saturday",  theme:"Love",       a:{ book:"1 Corinthians 13",   sub:"The Love Chapter",            focus:"Love as the greatest gift above all else" },    b:{ book:"John 15",            sub:"The Vine and Branches",       focus:"Abiding in Christ's love and bearing fruit" } },
  { day:7, name:"Sunday",    theme:"Rest",       a:{ book:"Psalm 23 + 119:1-32",sub:"The Good Shepherd",           focus:"Rest, reflection and gratitude" },              b:{ book:"Revelation 21-22",   sub:"The New Creation",            focus:"Hope: the end is a glorious beginning" } },
];
const EM = { Foundation:"🏛️", Faith:"🙏", Wisdom:"📜", Courage:"⚔️", Grace:"🕊️", Love:"❤️", Rest:"🌿" };
const QUOTES = [
  { t:"Your word is a lamp to my feet and a light to my path.", r:"Psalm 119:105" },
  { t:"Meditate on the Book of the Law day and night.", r:"Joshua 1:8" },
  { t:"Faith comes from hearing the word of Christ.", r:"Romans 10:17" },
  { t:"The unfolding of your words gives light.", r:"Psalm 119:130" },
  { t:"Man shall not live by bread alone.", r:"Matthew 4:4" },
  { t:"All Scripture is breathed out by God.", r:"2 Timothy 3:16" },
  { t:"Blessed is the one whose delight is in the law of the Lord.", r:"Psalm 1:1-2" },
];
const QUICK=["Praying for you today!","How is your reading going?","Be strong and courageous! - Joshua 1:9","Keep going, day by day!","Iron sharpens iron - Prov 27:17","His mercies are new every morning","Proud of your consistency!","What is God speaking to you today?"];

const RQ={
  "0-a":[{q:"On which day did God create light?",o:["Day 1","Day 2","Day 3","Day 4"],a:0,r:"Gen 1:3"},{q:"God said after completing creation?",o:["It is finished","It is very good","Let it be so","It is holy"],a:1,r:"Gen 1:31"},{q:"From what was Adam formed?",o:["Water","Clay","Dust from the ground","Stone"],a:2,r:"Gen 2:7"},{q:"What did God create on Day 6?",o:["Fish and birds","The sky","Land animals and humans","Sun and moon"],a:2,r:"Gen 1:24-27"},{q:"On which day did God rest?",o:["Day 5","Day 6","Day 7","Day 8"],a:2,r:"Gen 2:2"}],
  "0-b":[{q:"Psalm 1 - the righteous is compared to?",o:["A soaring eagle","A tree by streams","A burning fire","A strong mountain"],a:1,r:"Ps 1:3"},{q:"Psalm 1 - the wicked are like?",o:["Dry bones","Chaff blown by wind","A withered flower","A broken vessel"],a:1,r:"Ps 1:4"},{q:"Psalm 2 - who does God declare His Son?",o:["David","Solomon","The Anointed King","Abraham"],a:2,r:"Ps 2:7"},{q:"Psalm 3 was written fleeing from?",o:["Saul","His son Absalom","The Philistines","Goliath"],a:1,r:"Ps 3 title"},{q:"A blessed person meditates on God's what?",o:["Name","Law","Love","Power"],a:1,r:"Ps 1:2"}],
  "1-a":[{q:"Proverbs 3:5 - lean not on your own what?",o:["Strength","Wisdom","Understanding","Plans"],a:2,r:"Prov 3:5"},{q:"Proverbs 3:6 - He will make your what straight?",o:["Future","Paths","Steps","Ways"],a:1,r:"Prov 3:6"},{q:"Proverbs 3 - more precious than rubies?",o:["Gold","Understanding","Wisdom","Righteousness"],a:2,r:"Prov 3:15"},{q:"What should you not withhold from those it is due?",o:["Money","Praise","Good","Rest"],a:2,r:"Prov 3:27"},{q:"Proverbs 3:11 - do not despise the Lord's what?",o:["Name","Discipline","Gifts","Word"],a:1,r:"Prov 3:11"}],
  "1-b":[{q:"Hebrews 11:1 - faith is confidence in what we hope for and assurance about what we cannot?",o:["Understand","See","Know","Deserve"],a:1,r:"Heb 11:1"},{q:"By faith who offered a better sacrifice than Cain?",o:["Abel","Noah","Abraham","Isaac"],a:0,r:"Heb 11:4"},{q:"By faith who built an ark?",o:["Moses","Elijah","Noah","Abraham"],a:2,r:"Heb 11:7"},{q:"Which woman welcomed the spies by faith?",o:["Deborah","Ruth","Rahab","Esther"],a:2,r:"Heb 11:31"},{q:"By faith Abraham left not knowing where, God called him to?",o:["Move to Egypt","Leave his homeland","Climb a mountain","Build an altar"],a:1,r:"Heb 11:8"}],
  "2-a":[{q:"James says we should consider trials as?",o:["A burden","Pure joy","A sign of sin","A warning"],a:1,r:"Jas 1:2"},{q:"If anyone lacks wisdom James says ask?",o:["Elders","Teachers","God","Wise friends"],a:2,r:"Jas 1:5"},{q:"Temptation does NOT come from?",o:["Our desires","The world","God","The enemy"],a:2,r:"Jas 1:13"},{q:"Be quick to listen and slow to be?",o:["Proud","Angry","Judgmental","Foolish"],a:1,r:"Jas 1:19"},{q:"James compares what to a flower that withers?",o:["Wealth","Pride","Human life in its pursuits","Pleasure"],a:2,r:"Jas 1:10-11"}],
  "2-b":[{q:"Where does Wisdom call out in Proverbs 8?",o:["In the desert","At the city gates","In the temple","From a hilltop"],a:1,r:"Prov 8:2-3"},{q:"Proverbs 8 - wisdom is more valuable than?",o:["Gold and silver","Power and fame","Knowledge","A good name"],a:0,r:"Prov 8:10-11"},{q:"When was Wisdom present in Proverbs 8?",o:["After creation","During the Exodus","Before creation at God's side","At Solomon's coronation"],a:2,r:"Prov 8:22-23"},{q:"What does Wisdom prepare in Proverbs 9?",o:["A sacrifice","A feast","A temple","A scroll"],a:1,r:"Prov 9:2"},{q:"Proverbs 9:10 - beginning of wisdom is?",o:["Love","The fear of the Lord","Obedience","Understanding"],a:1,r:"Prov 9:10"}],
  "3-a":[{q:"Joshua 1 - God told Joshua to meditate on what?",o:["Promises","The Book of the Law","Works","Names"],a:1,r:"Josh 1:8"},{q:"How many times does God say be strong and courageous in Joshua 1?",o:["Once","Twice","Three times","Four times"],a:2,r:"Josh 1:6,7,9"},{q:"God would never leave Joshua or?",o:["Fail him","Forsake him","Test him","Judge him"],a:1,r:"Josh 1:5"},{q:"Joshua commanded officers to prepare?",o:["Weapons","Provisions for the journey","Sacrifices","New garments"],a:1,r:"Josh 1:11"},{q:"God promised every place Joshua's what would tread?",o:["Hand","Foot","Sword","Staff"],a:1,r:"Josh 1:3"}],
  "3-b":[{q:"How tall was Nebuchadnezzar's statue?",o:["30 cubits","60 cubits","90 cubits","120 cubits"],a:1,r:"Dan 3:1"},{q:"The three men in the furnace?",o:["Shadrach Meshach Abednego","Daniel Azariah Michael","Hananiah Joel Azariah","Simon Joshua Caleb"],a:0,r:"Dan 3:12"},{q:"How many times hotter was the furnace?",o:["3 times","5 times","7 times","10 times"],a:2,r:"Dan 3:19"},{q:"How many figures were seen in the fire?",o:["Two","Three","Four","Five"],a:2,r:"Dan 3:25"},{q:"The fourth figure looked like?",o:["A prophet","An angel","A son of the gods","A king"],a:2,r:"Dan 3:25"}],
  "4-a":[{q:"Romans 5 - through whom did sin enter?",o:["Eve","The serpent","Adam","Cain"],a:2,r:"Rom 5:12"},{q:"What did God demonstrate through Christ dying for us?",o:["His power","His love","His justice","His holiness"],a:1,r:"Rom 5:8"},{q:"Romans 6:23 - wages of sin are?",o:["Suffering","Death","Separation","Shame"],a:1,r:"Rom 6:23"},{q:"Romans 6 - dead to sin alive to?",o:["The Church","Moses","Christ Jesus","The Holy Spirit"],a:2,r:"Rom 6:11"},{q:"Romans 5:1 - peace with God through?",o:["The Holy Spirit","Our faith","Our Lord Jesus Christ","The apostles"],a:2,r:"Rom 5:1"}],
  "4-b":[{q:"Ephesians 2:8 - saved by grace through?",o:["Works","Faith","Prayer","The Law"],a:1,r:"Eph 2:8"},{q:"Ephesians 2:10 - we are God's what?",o:["Servants","Warriors","Handiwork","Students"],a:2,r:"Eph 2:10"},{q:"Ephesians 2:1 - dead in?",o:["Weakness","Transgressions and sins","Ignorance","Unbelief"],a:1,r:"Eph 2:1"},{q:"What has Christ broken down?",o:["The law","The dividing wall of hostility","The power of death","The gates of hell"],a:1,r:"Eph 2:14"},{q:"Ephesians 2:19 - members of?",o:["A holy nation","God's household","The new covenant","The body of Christ"],a:1,r:"Eph 2:19"}],
  "5-a":[{q:"Without love 1 Cor 13 says we are like?",o:["A broken sword","A resounding gong or clanging cymbal","An empty vessel","A dying branch"],a:1,r:"1 Cor 13:1"},{q:"Which is NOT a quality of love?",o:["Patient","Kind","Easily angered","Self-seeking"],a:2,r:"1 Cor 13:4-5"},{q:"What three things abide?",o:["Hope joy peace","Faith hope love","Grace mercy truth","Prayer faith service"],a:1,r:"1 Cor 13:13"},{q:"Now we see as through?",o:["A dark window","A poor reflection","A clouded veil","A thick fog"],a:1,r:"1 Cor 13:12"},{q:"When Paul became a man he put away?",o:["Childish ambitions","Childish ways","Childish fears","Childish friends"],a:1,r:"1 Cor 13:11"}],
  "5-b":[{q:"Jesus calls Himself in John 15:1?",o:["The Bread of Life","The True Vine","The Good Shepherd","The Light of the World"],a:1,r:"John 15:1"},{q:"Branches that do not bear fruit?",o:["Are pruned","Get more water","Are cut off","Are left alone"],a:2,r:"John 15:2"},{q:"Greatest love - lay down life for your?",o:["Enemies","Family","Friends","Neighbours"],a:2,r:"John 15:13"},{q:"John 15:16 - bear what kind of fruit?",o:["Much","Lasting","Good","Holy"],a:1,r:"John 15:16"},{q:"Love one another as?",o:["The Father loves","The world needs","I have loved you","The disciples did"],a:2,r:"John 15:12"}],
  "6-a":[{q:"Psalm 23 - Lord prepares what in presence of enemies?",o:["A shield","A table","A refuge","A path"],a:1,r:"Ps 23:5"},{q:"God leads us through?",o:["Valley of trouble","Valley of shadow of death","Valley of tears","Shadow of enemies"],a:1,r:"Ps 23:4"},{q:"What follows us all our days?",o:["Blessings and peace","Goodness and mercy","Joy and grace","Strength and courage"],a:1,r:"Ps 23:6"},{q:"Psalm 119:11 - what is hidden in the heart?",o:["God's name","God's word","God's love","God's promises"],a:1,r:"Ps 119:11"},{q:"Psalm 119:105 - God's word is a lamp and?",o:["Guide","Light to our path","Shield","Sword"],a:1,r:"Ps 119:105"}],
  "6-b":[{q:"Revelation 21 - what comes down from heaven?",o:["The New Temple","The Holy City New Jerusalem","A great army","The throne of God"],a:1,r:"Rev 21:2"},{q:"Revelation 21:4 - what will be no more?",o:["Night","Death mourning crying or pain","Evil and sin","The old earth"],a:1,r:"Rev 21:4"},{q:"Gates of New Jerusalem made of?",o:["Gold","Crystal","Pearls","Precious stones"],a:2,r:"Rev 21:21"},{q:"What grows on both sides of the river of life?",o:["Olive trees","The Tree of Life","Tree of Knowledge","Fruit trees"],a:1,r:"Rev 22:2"},{q:"Jesus repeats three times in Revelation 22?",o:["I am the Lord","I am coming soon","I am the First and Last","I am the Light"],a:1,r:"Rev 22:7,12,20"}],
};

const QB=[
  {q:"How many days did God take to create the world?",o:["5","6","7","8"],a:1,r:"Gen 1-2",c:"Old Testament"},
  {q:"Name of the garden where Adam and Eve lived?",o:["Eden","Canaan","Bethel","Goshen"],a:0,r:"Gen 2:8",c:"Old Testament"},
  {q:"How many of each animal did Noah take?",o:["One","Two","Seven","Ten"],a:1,r:"Gen 6:19",c:"Old Testament"},
  {q:"Who was sold into slavery by his brothers?",o:["Benjamin","Moses","Joseph","Esau"],a:2,r:"Gen 37:28",c:"Old Testament"},
  {q:"What instrument did David famously play?",o:["Trumpet","Harp","Flute","Tambourine"],a:1,r:"1 Sam 16:23",c:"Old Testament"},
  {q:"How many days was Jonah in the fish?",o:["One","Two","Three","Seven"],a:2,r:"Jonah 1:17",c:"Old Testament"},
  {q:"Who was the first king of Israel?",o:["David","Solomon","Saul","Samuel"],a:2,r:"1 Sam 10:24",c:"Old Testament"},
  {q:"What guided Israel at night in the wilderness?",o:["A bright star","A pillar of fire","An angel","A burning lamp"],a:1,r:"Exod 13:21",c:"Old Testament"},
  {q:"How many commandments did God give Moses?",o:["5","8","10","12"],a:2,r:"Exod 20",c:"Old Testament"},
  {q:"Which prophet was taken to heaven in a whirlwind?",o:["Elisha","Isaiah","Elijah","Jeremiah"],a:2,r:"2 Kings 2:11",c:"Old Testament"},
  {q:"Who wrote most of the Psalms?",o:["Solomon","Moses","David","Asaph"],a:2,r:"Psalm titles",c:"Old Testament"},
  {q:"What body of water did Moses part?",o:["Jordan River","Red Sea","Dead Sea","Sea of Galilee"],a:1,r:"Exod 14:21",c:"Old Testament"},
  {q:"Which book begins In the beginning?",o:["Psalms","John","Genesis","Exodus"],a:2,r:"Gen 1:1",c:"Old Testament"},
  {q:"In which town was Jesus born?",o:["Nazareth","Jerusalem","Bethlehem","Capernaum"],a:2,r:"Luke 2:4-7",c:"Gospels"},
  {q:"How many disciples did Jesus choose?",o:["7","10","12","14"],a:2,r:"Luke 6:13",c:"Gospels"},
  {q:"Jesus first recorded miracle?",o:["Healing the blind","Walking on water","Turning water into wine","Feeding 5000"],a:2,r:"John 2:1-11",c:"Gospels"},
  {q:"Who baptised Jesus?",o:["Peter","John the Baptist","Paul","Andrew"],a:1,r:"Matt 3:13-17",c:"Gospels"},
  {q:"How many loaves fed the 5000?",o:["2","3","5","10"],a:2,r:"John 6:9",c:"Gospels"},
  {q:"Zacchaeus profession?",o:["Fisherman","Tax collector","Carpenter","Priest"],a:1,r:"Luke 19:2",c:"Gospels"},
  {q:"Which disciple denied Jesus three times?",o:["John","James","Judas","Peter"],a:3,r:"Luke 22:61",c:"Gospels"},
  {q:"Greatest commandment?",o:["Keep the Sabbath","Love God with all your heart","Do not murder","Honour your parents"],a:1,r:"Matt 22:37",c:"Gospels"},
  {q:"How many days was Jesus tempted?",o:["7","14","40","3"],a:2,r:"Matt 4:2",c:"Gospels"},
  {q:"Who wrote Romans?",o:["Peter","James","Paul","John"],a:2,r:"Rom 1:1",c:"Epistles"},
  {q:"Who was struck blind on road to Damascus?",o:["Stephen","Barnabas","Saul","Silas"],a:2,r:"Acts 9:3-8",c:"Epistles"},
  {q:"Fruit of the Spirit?",o:["Faith hope love","Joy peace patience...","Power wisdom knowledge","Prayer fasting giving"],a:1,r:"Gal 5:22-23",c:"Epistles"},
  {q:"Who wrote Revelation?",o:["Paul","Peter","John","James"],a:2,r:"Rev 1:1",c:"Epistles"},
  {q:"What does Abba mean?",o:["Lord","Father","Master","Saviour"],a:1,r:"Rom 8:15",c:"Epistles"},
  {q:"Shortest verse in the Bible?",o:["God is love","Rejoice always","Jesus wept","Pray without ceasing"],a:2,r:"John 11:35",c:"Epistles"},
  {q:"I can do all things through Christ - who said this?",o:["Peter","David","Paul","James"],a:2,r:"Phil 4:13",c:"Epistles"},
  {q:"How many books are in the Bible?",o:["60","66","72","73"],a:1,r:"Canon",c:"Faith"},
  {q:"What does gospel mean?",o:["Holy Word","Good News","God's Law","Sacred Text"],a:1,r:"Mark 1:1",c:"Faith"},
  {q:"First book of New Testament?",o:["Mark","John","Acts","Matthew"],a:3,r:"NT canon",c:"Faith"},
  {q:"Last book of the Bible?",o:["Jude","Hebrews","Revelation","Malachi"],a:2,r:"Revelation",c:"Faith"},
  {q:"Which Psalm begins The Lord is my shepherd?",o:["Psalm 1","Psalm 23","Psalm 91","Psalm 119"],a:1,r:"Ps 23:1",c:"Faith"},
  {q:"What does Amen mean?",o:["Praise God","So be it / Truly","Thank you","Holy Holy Holy"],a:1,r:"Hebrew/Greek",c:"Faith"},
  {q:"What does Emmanuel mean?",o:["Lord saves","God with us","Prince of Peace","Lamb of God"],a:1,r:"Matt 1:23",c:"Faith"},
  {q:"How many books in Old Testament?",o:["35","39","42","46"],a:1,r:"OT canon",c:"Faith"},
];

const CATS=["This Week","All","Old Testament","Gospels","Epistles","Faith"];
const DIFFS=["Easy (10Q)","Medium (15Q)","Hard (20Q)"];
const DC=[10,15,20];

function buildPool(nA,nB){return Object.entries(RQ).flatMap(([k,qs])=>{const[di,s]=k.split("-");const d=DAYS[+di];const p=s==="a"?nA:nB;return qs.map(q=>({...q,c:"This Week",tag:`${p}: ${d[s].book}`}));});}
function shuffle(a){const b=[...a];for(let i=b.length-1;i>0;i--){const j=0|Math.random()*(i+1);[b[i],b[j]]=[b[j],b[i]];}return b;}
const LS={get:(k,d)=>{try{const v=localStorage.getItem(k);return v!=null?JSON.parse(v):d;}catch{return d;}},set:(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v));}catch{}},clear:()=>{try{localStorage.clear();}catch{}}};
function fmt(ts){return new Date(ts).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});}
function fmtD(ts){const d=new Date(ts),t=new Date();if(d.toDateString()===t.toDateString())return"Today";const y=new Date(t);y.setDate(t.getDate()-1);if(d.toDateString()===y.toDateString())return"Yesterday";return d.toLocaleDateString([],{weekday:"short",month:"short",day:"numeric"});}
function doCascade(di,side,draft,cR){const u={[`${di}-${side}`]:{book:draft.book.trim(),sub:draft.sub.trim(),focus:draft.focus.trim()}};const m=draft.book.trim().match(/^(.+?)\s+(\d+)(?:[-](\d+))?$/);for(let i=di+1;i<7;i++){const off=i-di,def=DAYS[i][side];let bk=draft.book.trim();if(m){const st=+m[2],en=m[3]?+m[3]:st,sp=en-st;const ns=en+1+(off-1)*(sp+1);bk=`${m[1]} ${ns}${sp>0?`-${ns+sp}`:""}`;}else bk=`${draft.book.trim()} (Day ${i+1})`;u[`${i}-${side}`]={book:bk,sub:draft.sub.trim()||def.sub,focus:draft.focus.trim()||def.focus};}return u;}

export default function App(){
  return (<AccessGate><MainApp/></AccessGate>);
}

function MainApp(){
  const[ob,setOb]=useState(()=>LS.get("br_ob",false));
  const[names,setNames]=useState(()=>LS.get("br_names",{a:"",b:""}));
  const[au,setAu]=useState(()=>LS.get("br_au",null));
  const[checks,setChecks]=useState(()=>LS.get("br_checks",{}));
  const[notes,setNotes]=useState(()=>LS.get("br_notes",{a:"",b:""}));
  const[msgs,setMsgs]=useState(()=>LS.get("br_msgs",[]));
  const[cR,setCR]=useState(()=>LS.get("br_cr",{}));
  const[tid,setTid]=useState(()=>LS.get("br_theme","dark"));
  const[hist,setHist]=useState(()=>LS.get("br_hist",[]));
  const[tab,setTab]=useState("home");
  const[toast,setToast]=useState(null);
  const[qIdx,setQIdx]=useState(0);
  const[openDay,setOpenDay]=useState(null);
  const T=THEMES[tid]||THEMES.dark;
  useEffect(()=>LS.set("br_ob",ob),[ob]);
  useEffect(()=>LS.set("br_names",names),[names]);
  useEffect(()=>LS.set("br_au",au),[au]);
  useEffect(()=>LS.set("br_checks",checks),[checks]);
  useEffect(()=>LS.set("br_notes",notes),[notes]);
  useEffect(()=>LS.set("br_msgs",msgs),[msgs]);
  useEffect(()=>LS.set("br_cr",cR),[cR]);
  useEffect(()=>LS.set("br_theme",tid),[tid]);
  useEffect(()=>LS.set("br_hist",hist),[hist]);
  const toast_=useCallback(m=>{setToast(m);setTimeout(()=>setToast(null),3000);},[]);
  const archiveWeek=useCallback(ch=>{
    const dA=DAYS.filter((_,i)=>ch[`${i}-a`]).length,dB=DAYS.filter((_,i)=>ch[`${i}-b`]).length;
    let s=0;for(let i=0;i<7;i++){if(ch[`${i}-a`]||ch[`${i}-b`])s++;else break;}
    const qs=LS.get("br_quiz",{a:{best:0,total:0,played:0},b:{best:0,total:0,played:0}});
    setHist(p=>[...p,{id:Date.now(),date:new Date().toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"}),weekNum:p.length+1,doneA:dA,doneB:dB,streak:s,qA:qs.a.best,qB:qs.b.best,pA:dA===7,pB:dB===7}]);
  },[]);
  const sendMsg=useCallback((text,type="text",meta=null)=>{
    if(!text.trim()&&type==="text")return;
    setMsgs(p=>[...p,{id:Date.now(),from:au,text,type,meta,ts:Date.now()}]);
  },[au]);
  const toggle=(di,side)=>{
    setChecks(prev=>{
      const next={...prev,[`${di}-${side}`]:!prev[`${di}-${side}`]};
      if(next[`${di}-${side}`]){
        const nm=side==="a"?(names.a||"Reading"):(names.b||"Reading");
        toast_(`Day ${di+1} ${side==="a"?"morning":"evening"} complete!`);
        if(DAYS.every((_,i)=>next[`${i}-a`]&&next[`${i}-b`]))setTimeout(()=>toast_("Perfect week! Every reading done!"),900);
      }
      return next;
    });
  };
  const fullReset=useCallback(()=>{
    LS.clear();
    setOb(false);setNames({a:"",b:""});setAu(null);setChecks({});
    setNotes({a:"",b:""});setMsgs([]);setCR({});setHist([]);setTab("home");
  },[]);
  const nA=names.a||"Track A",nB=names.b||"Track B";
  const dA=DAYS.filter((_,i)=>checks[`${i}-a`]).length,dB=DAYS.filter((_,i)=>checks[`${i}-b`]).length;
  let streak=0;for(let i=0;i<7;i++){if(checks[`${i}-a`]||checks[`${i}-b`])streak++;else break;}
  const done_=({names:n,tid:t,au:u})=>{setNames(n);setTid(t);setAu(u);setOb(true);};
  if(!ob)return(<ThemeCtx.Provider value={THEMES[tid]||THEMES.dark}><Onboard onDone={done_} tid={tid} setTid={setTid}/></ThemeCtx.Provider>);
  if(!au)return(<ThemeCtx.Provider value={T}><WhoScreen nA={nA} nB={nB} setAu={setAu}/></ThemeCtx.Provider>);
  const myName=au==="a"?nA:nB,pName=au==="a"?nB:nA,myDone=au==="a"?dA:dB,pDone=au==="a"?dB:dA;
  return(<ThemeCtx.Provider value={T}>
    <div style={{minHeight:"100vh",background:T.bg,display:"flex",justifyContent:"center",fontFamily:T.bf,fontSize:`${T.fs}rem`,lineHeight:T.lh,letterSpacing:T.ls}}>
    <div style={{width:"100%",maxWidth:430,minHeight:"100vh",background:T.surface,display:"flex",flexDirection:"column"}}>
      {tab==="home"&&<HomeScreen myName={myName} pName={pName} myDone={myDone} pDone={pDone} streak={streak} qIdx={qIdx} setQIdx={setQIdx} setTab={setTab} au={au}/>}
      {tab==="schedule"&&<ScheduleScreen checks={checks} toggle={toggle} openDay={openDay} setOpenDay={setOpenDay} nA={nA} nB={nB} au={au} cR={cR} setCR={setCR} toast_={toast_}/>}
      {tab==="progress"&&<ProgressScreen checks={checks} dA={dA} dB={dB} streak={streak} nA={nA} nB={nB} setChecks={setChecks} toast_={toast_} archiveWeek={archiveWeek} hist={hist}/>}
      {tab==="notes"&&<NotesScreen notes={notes} setNotes={setNotes} nA={nA} nB={nB} au={au}/>}
      {tab==="quiz"&&<QuizScreen nA={nA} nB={nB} au={au} toast_={toast_}/>}
      {tab==="growth"&&<GrowthScreen hist={hist} nA={nA} nB={nB}/>}
      {tab==="settings"&&<SettingsScreen names={names} au={au} setAu={setAu} toast_={toast_} setChecks={setChecks} setNotes={setNotes} setMsgs={setMsgs} setCR={setCR} tid={tid} setTid={setTid} archiveWeek={archiveWeek} checks={checks} setHist={setHist} fullReset={fullReset}/>}
      <BottomNav tab={tab} setTab={setTab}/>
      {toast&&<div role="status" aria-live="polite" style={{position:"fixed",bottom:80,left:"50%",transform:"translateX(-50%)",background:T.sage,color:"#fff",padding:"9px 16px",borderRadius:20,fontSize:"0.8rem",fontWeight:"bold",boxShadow:"0 4px 20px rgba(0,0,0,0.4)",zIndex:100,whiteSpace:"nowrap",maxWidth:300,textAlign:"center"}}>{toast}</div>}
    </div></div>
  </ThemeCtx.Provider>);
}

const STEPS=["welcome","theme","names","who","ready"];
function Onboard({onDone,tid,setTid}){
  const T=useT();
  const[step,setStep]=useState(0);
  const[nA,setNA]=useState("");const[nB,setNB]=useState("");const[who,setWho]=useState(null);
  const sid=STEPS[step],pct=Math.round((step/(STEPS.length-1))*100);
  const next=()=>setStep(s=>s+1),back=()=>setStep(s=>s-1);
  const PB={background:T.gold,color:"#1a1a2e",border:"none",borderRadius:20,padding:"12px 20px",fontWeight:"bold",cursor:"pointer",fontSize:`${0.88*T.fs}rem`,width:"100%"};
  const BD={flex:1,overflowY:"auto",padding:"24px 20px",display:"flex",flexDirection:"column",gap:15};
  return(<div style={{minHeight:"100vh",background:T.bg,display:"flex",justifyContent:"center",fontFamily:T.bf,fontSize:`${T.fs}rem`}}>
  <div style={{width:"100%",maxWidth:430,minHeight:"100vh",background:T.surface,display:"flex",flexDirection:"column"}}>
    {sid!=="welcome"&&(<div style={{padding:"12px 20px 0",flexShrink:0}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:5}}><span style={{color:T.faint,fontSize:"0.64rem",letterSpacing:1}}>STEP {step} OF {STEPS.length-1}</span>{step>0&&<button style={{background:"none",border:"none",color:T.muted,cursor:"pointer",fontSize:"0.76rem"}} onClick={back}>Back</button>}</div><div style={{background:T.border,borderRadius:4,height:4,overflow:"hidden"}}><div style={{width:`${pct}%`,height:"100%",background:T.gold,borderRadius:4,transition:"width 0.4s"}}/></div></div>)}
    {sid==="welcome"&&(<div style={{...BD,justifyContent:"center",textAlign:"center",gap:15}}>
      <div><div style={{fontSize:"2.8rem",marginBottom:5}}>✝️</div><div style={{color:T.gold,letterSpacing:4,fontSize:"0.88rem",marginBottom:10}}>✦ ✦ ✦</div><h1 style={{fontFamily:T.hf,color:T.text,fontSize:`${1.7*T.fs}rem`,lineHeight:1.2,margin:"0 0 8px"}}>Daily<br/><em style={{color:T.gold}}>Habit</em></h1><p style={{color:T.mid,fontSize:`${0.84*T.fs}rem`,lineHeight:T.lh}}>A weekly Scripture reading companion \u2014 for you, or to follow alongside a friend.</p></div>
      <div style={{display:"flex",flexDirection:"column",gap:6,textAlign:"left"}}>{[["📖","7-day reading schedule","Two themed Scripture readings each day"],["🎯","Bible quiz","Questions from Scripture and your own readings"],["📓","Reflection notes","Journal your thoughts and prayers as you read"],["📈","Growth tracking","Archive weeks and track consistency over time"],["🎨","Accessibility themes","Dark, light, dyslexia-friendly, high contrast and more"]].map(([ic,tt,dd])=>(<div key={tt} style={{display:"flex",gap:8,alignItems:"flex-start",background:T.s2,border:`1px solid ${T.border}`,borderRadius:T.rs,padding:"8px 10px"}}><span style={{fontSize:"1.1rem",flexShrink:0}}>{ic}</span><div><div style={{color:T.text,fontSize:`${0.81*T.fs}rem`,fontWeight:"bold"}}>{tt}</div><div style={{color:T.muted,fontSize:"0.7rem",marginTop:1}}>{dd}</div></div></div>))}</div>
      <button style={PB} onClick={next}>Get Started</button>
      <p style={{color:T.faint,fontSize:"0.64rem"}}>Takes about 2 minutes to set up</p>
    </div>)}
    {sid==="theme"&&(<div style={BD}>
      <div><div style={{fontSize:"1.4rem",marginBottom:5}}>🎨</div><h2 style={{fontFamily:T.hf,color:T.text,fontSize:`${1.25*T.fs}rem`,margin:"0 0 5px"}}>Choose Your Theme</h2><p style={{color:T.muted,fontSize:"0.76rem",margin:0,lineHeight:T.lh}}>Pick what is most comfortable. You can change it anytime in Settings.</p></div>
      <div style={{display:"flex",flexDirection:"column",gap:6}}>{Object.values(THEMES).map(th=>(<button key={th.id} style={{display:"flex",alignItems:"center",gap:9,padding:"10px 11px",borderRadius:T.rs,border:`${tid===th.id?"2px":"1px"} solid ${tid===th.id?T.gold:T.border}`,background:tid===th.id?T.gold+"18":T.ib,cursor:"pointer",textAlign:"left"}} onClick={()=>setTid(th.id)}><span style={{fontSize:"1.25rem",flexShrink:0}}>{th.icon}</span><div style={{flex:1}}><div style={{color:tid===th.id?T.gold:T.text,fontWeight:"bold",fontSize:`${0.83*T.fs}rem`}}>{th.label}</div><div style={{color:T.muted,fontSize:"0.67rem",marginTop:1,lineHeight:1.3}}>{th.desc}</div></div>{tid===th.id&&<span style={{color:T.gold}}>✓</span>}</button>))}</div>
      <button style={PB} onClick={next}>Continue</button>
    </div>)}
    {sid==="names"&&(<div style={BD}>
      <div><div style={{fontSize:"1.4rem",marginBottom:5}}>👥</div><h2 style={{fontFamily:T.hf,color:T.text,fontSize:`${1.25*T.fs}rem`,margin:"0 0 5px"}}>Set Up Your Tracks</h2><p style={{color:T.muted,fontSize:"0.76rem",margin:0,lineHeight:T.lh}}>Set up two reading tracks. Use both yourself, or share the plan with a friend \u2014 each of you reads on your own device.</p></div>
      {[{id:"obA",val:nA,set:setNA,label:"Track A",ph:"e.g. your name",color:T.gold},{id:"obB",val:nB,set:setNB,label:"Track B (optional)",ph:"e.g. a friend",color:T.sage}].map(f=>(<div key={f.id}><label style={{color:T.muted,fontSize:"0.72rem",display:"block",marginBottom:5}} htmlFor={f.id}>{f.label}</label><div style={{display:"flex",alignItems:"center",gap:7,background:T.ib,border:`2px solid ${f.val.trim()?f.color:T.border}`,borderRadius:T.rs,padding:"2px 10px 2px 3px"}}><div style={{width:32,height:32,borderRadius:"50%",background:f.color+"22",color:f.color,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:T.hf,fontWeight:"bold",flexShrink:0}}>{f.val.trim()?f.val.trim()[0].toUpperCase():"?"}</div><input id={f.id} style={{flex:1,background:"transparent",border:"none",color:T.text,padding:"9px 0",fontFamily:T.hf,fontSize:`${0.9*T.fs}rem`,outline:"none"}} value={f.val} maxLength={24} onChange={e=>f.set(e.target.value)} placeholder={f.ph} autoComplete="off"/></div></div>))}
      <div style={{background:T.gold+"0b",border:`1px solid ${T.gold}1e`,borderRadius:T.rs,padding:"8px 11px",display:"flex",gap:7}}><span>🔒</span><p style={{color:T.muted,fontSize:"0.68rem",margin:0,lineHeight:T.lh}}>Names cannot be changed without a full reset which clears all data.</p></div>
      <button style={{...PB,opacity:nA.trim()?1:0.4}} disabled={!nA.trim()} onClick={()=>{if(!nB.trim())setNB("Track B");next();}}>Confirm Names</button>
    </div>)}
    {sid==="who"&&(<div style={BD}>
      <div><div style={{fontSize:"1.4rem",marginBottom:5}}>👤</div><h2 style={{fontFamily:T.hf,color:T.text,fontSize:`${1.25*T.fs}rem`,margin:"0 0 5px"}}>Which Track Is Yours?</h2><p style={{color:T.muted,fontSize:"0.76rem",margin:0,lineHeight:T.lh}}>Select your track. You can switch between tracks anytime in Settings.</p></div>
      <div style={{display:"flex",flexDirection:"column",gap:9}}>{[{id:"a",name:nA.trim(),color:T.gold},{id:"b",name:nB.trim(),color:T.sage}].map(p=>(<button key={p.id} style={{display:"flex",alignItems:"center",gap:11,padding:"13px 14px",borderRadius:T.r,border:`${who===p.id?"2px":"1px"} solid ${who===p.id?p.color:T.border}`,background:who===p.id?p.color+"18":T.s2,cursor:"pointer",textAlign:"left"}} onClick={()=>setWho(p.id)}><div style={{width:42,height:42,borderRadius:"50%",background:p.color+"22",color:p.color,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:T.hf,fontWeight:"bold",fontSize:"1.2rem",flexShrink:0}}>{p.name[0]?.toUpperCase()}</div><div style={{flex:1}}><div style={{color:T.text,fontFamily:T.hf,fontSize:`${0.93*T.fs}rem`}}>{p.name}</div><div style={{color:T.muted,fontSize:"0.68rem",marginTop:2}}>Tap to select</div></div><div style={{width:20,height:20,borderRadius:"50%",border:`2px solid ${who===p.id?p.color:T.border}`,background:who===p.id?p.color:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{who===p.id&&<span style={{color:"white",fontSize:"0.6rem"}}>✓</span>}</div></button>))}</div>
      <button style={{...PB,opacity:who?1:0.4}} disabled={!who} onClick={next}>That is Me</button>
    </div>)}
    {sid==="ready"&&(<div style={{...BD,justifyContent:"center",textAlign:"center",gap:17}}>
      <div><div style={{fontSize:"3rem",marginBottom:8}}>🎉</div><h2 style={{fontFamily:T.hf,color:T.gold,fontSize:`${1.55*T.fs}rem`,margin:"0 0 8px",lineHeight:1.2}}>You are all set,<br/>{who==="a"?nA.trim():nB.trim()}!</h2><p style={{color:T.mid,fontSize:`${0.83*T.fs}rem`,lineHeight:T.lh}}>Your timetable is ready. Track <strong style={{color:who==="a"?T.sage:T.gold}}>{who==="a"?nB.trim():nA.trim()}</strong>'s readings here too, or follow along together.</p></div>
      <div style={{background:T.s2,border:`1px solid ${T.border}`,borderRadius:T.r,padding:"13px 14px",textAlign:"left"}}><div style={{color:T.gold,fontFamily:T.hf,fontSize:"0.83rem",marginBottom:9}}>Setup summary</div>{[{ic:"👤",lb:"You",v:who==="a"?nA.trim():nB.trim()},{ic:"🤝",lb:"Track B",v:who==="a"?nB.trim():nA.trim()},{ic:"🎨",lb:"Theme",v:THEMES[tid]?.label}].map(r=>(<div key={r.lb} style={{display:"flex",gap:9,alignItems:"center",marginBottom:6}}><span>{r.ic}</span><span style={{color:T.muted,fontSize:"0.72rem",minWidth:50}}>{r.lb}</span><span style={{color:T.text,fontSize:"0.81rem",fontWeight:"bold"}}>{r.v}</span></div>))}</div>
      <div style={{background:T.gold+"0e",border:`1px solid ${T.gold}2e`,borderRadius:T.r,padding:"11px 13px"}}><p style={{color:T.mid,fontFamily:T.hf,fontStyle:"italic",fontSize:`${0.81*T.fs}rem`,lineHeight:T.lh,margin:0}}>Two are better than one — if either falls down, one can help the other up.</p><div style={{color:T.gold,fontSize:"0.67rem",marginTop:4}}>Ecclesiastes 4:9-10</div></div>
      <button style={PB} onClick={()=>onDone({names:{a:nA.trim(),b:nB.trim()},tid,au:who})}>Open My Timetable</button>
    </div>)}
  </div></div>);
}

function WhoScreen({nA,nB,setAu}){
  const T=useT();
  return(<div style={{minHeight:"100vh",background:T.bg,display:"flex",justifyContent:"center",fontFamily:T.bf}}><div style={{width:"100%",maxWidth:430,minHeight:"100vh",background:T.surface,padding:"44px 18px",display:"flex",flexDirection:"column",gap:15,justifyContent:"center"}}>
    <div style={{textAlign:"center"}}><div style={{color:T.gold,letterSpacing:4,marginBottom:7}}>✦ ✝ ✦</div><h2 style={{fontFamily:T.hf,color:T.text,fontSize:`${1.3*T.fs}rem`,margin:"0 0 5px"}}>Who is reading today?</h2><p style={{color:T.muted,fontSize:"0.76rem"}}>Select your name to track your progress</p></div>
    {[{id:"a",name:nA,color:T.gold},{id:"b",name:nB,color:T.sage}].map(p=>(<button key={p.id} style={{background:T.s2,border:`1px solid ${p.color}55`,borderRadius:T.r,padding:"13px 14px",display:"flex",alignItems:"center",gap:11,cursor:"pointer",textAlign:"left",width:"100%"}} onClick={()=>setAu(p.id)}><div style={{width:42,height:42,borderRadius:"50%",background:p.color+"22",color:p.color,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:T.hf,fontWeight:"bold",fontSize:"1.2rem",flexShrink:0}}>{p.name[0]?.toUpperCase()}</div><div><div style={{color:T.text,fontFamily:T.hf,fontSize:`${0.95*T.fs}rem`}}>{p.name}</div><div style={{color:T.muted,fontSize:"0.68rem",marginTop:1}}>Tap to continue</div></div><span style={{color:p.color,fontSize:"1.3rem",marginLeft:"auto"}}>›</span></button>))}
  </div></div>);
}

function HomeScreen({myName,pName,myDone,pDone,streak,qIdx,setQIdx,setTab,au}){
  const T=useT();
  const q=QUOTES[qIdx%QUOTES.length];
  const today=new Date().toLocaleDateString("en-GB",{weekday:"long",day:"numeric",month:"long"});
  const di=(()=>{const d=new Date().getDay();return d===0?6:d-1;})();
  const td=DAYS[di],myC=au==="a"?T.gold:T.sage,pC=au==="a"?T.sage:T.gold;
  return(<div style={{flex:1,overflowY:"auto",padding:"20px 15px 86px",display:"flex",flexDirection:"column",gap:12}}>
    <div style={{textAlign:"center"}}><div style={{color:T.gold,letterSpacing:4,fontSize:"0.88rem"}}>✦ ✝ ✦</div><h1 style={{fontFamily:T.hf,fontSize:`${1.7*T.fs}rem`,color:T.text,margin:"5px 0 2px",lineHeight:1.2}}>Welcome,<br/><em style={{color:myC}}>{myName}</em></h1><p style={{color:T.muted,fontSize:"0.71rem",letterSpacing:1}}>{today}</p></div>
    <div style={{display:"flex",gap:7}}>{[{ic:"🔥",v:streak,lb:"Streak",c:T.gold},{ic:"📖",v:myDone,lb:"My days",c:myC},{ic:"🤝",v:pDone,lb:pName.split(" ")[0],c:pC}].map(x=>(<div key={x.lb} style={{flex:1,background:T.s2,border:`1px solid ${x.c}44`,borderRadius:T.r,padding:"8px 5px",textAlign:"center",display:"flex",flexDirection:"column",gap:2,alignItems:"center"}}><span style={{fontSize:"0.93rem"}}>{x.ic}</span><span style={{fontFamily:T.hf,fontSize:`${1.4*T.fs}rem`,color:x.c,lineHeight:1}}>{x.v}</span><span style={{color:T.muted,fontSize:"0.57rem",letterSpacing:1,textTransform:"uppercase"}}>{x.lb}</span></div>))}</div>
    <div style={{background:T.s2,border:`1px solid ${pC}44`,borderRadius:T.r,padding:"10px 12px",display:"flex",alignItems:"center",gap:9}}><span>🤝</span><div style={{flex:1}}><div style={{color:T.mid,fontSize:"0.73rem"}}><strong style={{color:pC}}>{pName}</strong> has completed {pDone}/7 days</div><div style={{background:T.border,borderRadius:4,height:5,marginTop:3,overflow:"hidden"}}><div style={{width:`${Math.round(pDone/7*100)}%`,height:"100%",background:pC,borderRadius:4,transition:"width 0.8s"}}/></div></div><span style={{color:pC,fontSize:"0.7rem",fontWeight:"bold"}}>{Math.round(pDone/7*100)}%</span></div>
    <div style={{background:T.id==="light"||T.id==="sepia"||T.id==="dyslexia"?T.s2:"linear-gradient(135deg,#3a1020,#1a0a14)",border:`1px solid ${T.gold}33`,borderRadius:T.r,padding:"14px",textAlign:"center"}}><p style={{color:T.text,fontStyle:"italic",fontSize:`${0.85*T.fs}rem`,lineHeight:T.lh,margin:0}}>"{q.t}"</p><p style={{color:T.gold,fontSize:"0.67rem",marginTop:5}}>— {q.r}</p><button style={{marginTop:8,background:"transparent",border:`1px solid ${T.gold}55`,color:T.gold,padding:"4px 11px",borderRadius:18,cursor:"pointer",fontSize:"0.67rem"}} onClick={()=>setQIdx(i=>(i+1)%QUOTES.length)}>New Verse</button></div>
    <button style={{background:`${T.gold}12`,border:`1px solid ${T.gold}44`,borderRadius:T.r,padding:"11px 13px",display:"flex",justifyContent:"space-between",alignItems:"center",cursor:"pointer",textAlign:"left",width:"100%",color:"inherit"}} onClick={()=>setTab("schedule")}><div style={{display:"flex",alignItems:"center",gap:9}}><span style={{fontSize:"1.35rem"}}>{EM[td.theme]}</span><div><div style={{color:T.gold,fontSize:"0.63rem",letterSpacing:2,textTransform:"uppercase"}}>{td.theme}</div><div style={{color:T.mid,fontSize:`${0.8*T.fs}rem`,marginTop:2}}>Today - {td.name}</div></div></div><span style={{color:T.gold,fontSize:"1.5rem"}}>›</span></button>
    <p style={{color:T.faint,fontSize:"0.71rem",textAlign:"center",fontStyle:"italic"}}>Iron sharpens iron — keep each other accountable.</p>
  </div>);
}

function ScheduleScreen({checks,toggle,openDay,setOpenDay,nA,nB,au,cR,setCR,toast_}){
  const T=useT();
  return(<div style={{flex:1,overflowY:"auto",padding:"20px 15px 86px",display:"flex",flexDirection:"column",gap:11}}><h2 style={{fontFamily:T.hf,color:T.text,fontSize:"1.22rem",margin:0}}>Weekly Schedule</h2><p style={{color:T.muted,fontSize:"0.7rem",margin:0}}>Tap a day to expand and check off readings</p><div style={{display:"flex",flexDirection:"column",gap:7}}>{DAYS.map((d,i)=><DayCard key={i} d={d} idx={i} checks={checks} toggle={toggle} open={openDay===i} onToggle={()=>setOpenDay(openDay===i?null:i)} nA={nA} nB={nB} au={au} cR={cR} setCR={setCR} toast_={toast_}/>)}</div></div>);
}
function DayCard({d,idx,checks,toggle,open,onToggle,nA,nB,au,cR,setCR,toast_}){
  const T=useT();
  const dA=checks[`${idx}-a`],dB=checks[`${idx}-b`];
  const rA={...d.a,...(cR[`${idx}-a`]||{})},rB={...d.b,...(cR[`${idx}-b`]||{})};
  return(<div style={{background:T.s2,border:`1px solid ${dA&&dB?T.gold+"55":T.border}`,borderRadius:T.r,overflow:"hidden"}}>
    <button style={{width:"100%",background:"none",border:"none",display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 12px",cursor:"pointer",textAlign:"left"}} onClick={onToggle} aria-expanded={open}>
      <div style={{display:"flex",alignItems:"center",gap:7}}><span style={{fontSize:"1.1rem"}}>{EM[d.theme]}</span><div><div style={{color:T.text,fontFamily:T.hf,fontSize:`${0.88*T.fs}rem`}}>Day {d.day} — {d.name}</div><div style={{color:T.muted,fontSize:"0.6rem",letterSpacing:1,textTransform:"uppercase"}}>{d.theme}</div></div></div>
      <div style={{display:"flex",alignItems:"center",gap:5}}><span style={{width:8,height:8,borderRadius:"50%",border:`2px solid ${T.gold}`,background:dA?T.gold:"transparent",display:"inline-block"}}/><span style={{width:8,height:8,borderRadius:"50%",border:`2px solid ${T.sage}`,background:dB?T.sage:"transparent",display:"inline-block"}}/><span style={{color:T.muted,fontSize:"1rem",display:"inline-block",transition:"transform 0.2s",transform:open?"rotate(90deg)":"rotate(0)"}}>›</span></div>
    </button>
    {open&&(<div style={{padding:"0 11px 11px",display:"flex",flexDirection:"column",gap:8}}>
      <RRow label={nA} color={T.gold} reading={rA} done={dA} onToggle={()=>toggle(idx,"a")} isMe={au==="a"} isCustom={!!cR[`${idx}-a`]} di={idx} side="a" cR={cR} setCR={setCR} defR={d.a} toast_={toast_}/>
      <RRow label={nB} color={T.sage} reading={rB} done={dB} onToggle={()=>toggle(idx,"b")} isMe={au==="b"} isCustom={!!cR[`${idx}-b`]} di={idx} side="b" cR={cR} setCR={setCR} defR={d.b} toast_={toast_}/>
    </div>)}
  </div>);
}
function RRow({label,color,reading,done,onToggle,isMe,isCustom,di,side,cR,setCR,defR,toast_}){
  const T=useT();
  const[edit,setEdit]=useState(false);
  const[draft,setDraft]=useState({book:reading.book,sub:reading.sub,focus:reading.focus});
  const[casc,setCasc]=useState(false);
  const isLast=di===6;
  useEffect(()=>setDraft({book:reading.book,sub:reading.sub,focus:reading.focus}),[reading.book,reading.sub,reading.focus]);
  const save=(withC)=>{
    if(!draft.book.trim())return;
    if(withC&&!isLast){setCR(p=>({...p,...doCascade(di,side,draft,cR)}));toast_(`Updated + ${6-di} days adjusted`);}
    else{setCR(p=>({...p,[`${di}-${side}`]:{book:draft.book.trim(),sub:draft.sub.trim(),focus:draft.focus.trim()}}));toast_("Reading updated");}
    setEdit(false);setCasc(false);
  };
  const resetD=()=>{setCR(p=>{const n={...p};delete n[`${di}-${side}`];return n;});setDraft({book:defR.book,sub:defR.sub,focus:defR.focus});setEdit(false);setCasc(false);toast_("Reset to default");};
  const resetF=()=>{setCR(p=>{const n={...p};for(let i=di;i<7;i++)delete n[`${i}-${side}`];return n;});setEdit(false);setCasc(false);toast_(`Days ${di+1}-7 reset`);};
  const iS={color:T.text,background:T.ib,border:`1px solid ${T.border}`,borderRadius:T.rs,padding:"6px 9px",fontSize:`${0.8*T.fs}rem`,outline:"none",width:"100%"};
  return(<div style={{borderLeft:`3px solid ${color}`,borderRadius:T.r,background:color+"0d",overflow:"hidden"}}>
    <div style={{padding:"8px 10px",display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:7}}>
      <div style={{display:"flex",gap:6,flex:1,minWidth:0}}>
        <span style={{fontSize:"0.53rem",fontWeight:700,letterSpacing:1,padding:"2px 5px",borderRadius:6,background:color,color:color===T.gold?"#1a1a2e":"white",whiteSpace:"nowrap",flexShrink:0,marginTop:2}}>{label.toUpperCase().slice(0,10)}</span>
        <div style={{flex:1,minWidth:0}}>
          <div style={{display:"flex",alignItems:"center",gap:4,flexWrap:"wrap"}}><div style={{color:T.text,fontFamily:T.hf,fontSize:`${0.82*T.fs}rem`,fontWeight:"bold"}}>{reading.book}</div>{isCustom&&<span style={{background:color+"25",color,fontSize:"0.52rem",padding:"1px 4px",borderRadius:5}}>EDITED</span>}</div>
          <div style={{color:T.muted,fontSize:`${0.66*T.fs}rem`,marginTop:1}}>{reading.sub}</div>
          {reading.focus&&<div style={{color:T.faint,fontSize:`${0.64*T.fs}rem`,fontStyle:"italic",marginTop:2}}>💡 {reading.focus}</div>}
          {!isMe&&<div style={{color,fontSize:"0.62rem",marginTop:2}}>Other track</div>}
        </div>
      </div>
      <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4,flexShrink:0}}>
        <button style={{width:24,height:24,borderRadius:"50%",border:`2px solid ${done?T.sage:"#888"}`,background:done?T.sage:"transparent",cursor:isMe?"pointer":"default",color:"white",fontSize:"0.75rem",display:"flex",alignItems:"center",justifyContent:"center",opacity:isMe?1:0.35}} onClick={isMe?onToggle:undefined} aria-pressed={done}>{done?"✓":""}</button>
        {isMe&&<button style={{width:24,height:24,borderRadius:"50%",border:`1px solid ${color}44`,background:"transparent",cursor:"pointer",color,fontSize:"0.68rem",display:"flex",alignItems:"center",justifyContent:"center"}} onClick={()=>{setEdit(e=>!e);setCasc(false);}}>{edit?"✕":"✏️"}</button>}
      </div>
    </div>
    {edit&&isMe&&(<div style={{borderTop:`1px solid ${color}1e`,padding:"8px 10px 10px",background:"rgba(0,0,0,0.08)",display:"flex",flexDirection:"column",gap:7}}>
      <div style={{color,fontSize:"0.64rem",letterSpacing:1,textTransform:"uppercase"}}>Edit Reading</div>
      <div><label style={{color:T.muted,fontSize:"0.66rem",display:"block",marginBottom:3}}>Book and Chapters</label><input style={iS} value={draft.book} onChange={e=>setDraft(d=>({...d,book:e.target.value}))} placeholder="e.g. Romans 8" maxLength={80}/></div>
      <div><label style={{color:T.muted,fontSize:"0.66rem",display:"block",marginBottom:3}}>Title</label><input style={iS} value={draft.sub} onChange={e=>setDraft(d=>({...d,sub:e.target.value}))} placeholder="e.g. Life in the Spirit" maxLength={80}/></div>
      <div><label style={{color:T.muted,fontSize:"0.66rem",display:"block",marginBottom:3}}>Focus</label><input style={iS} value={draft.focus} onChange={e=>setDraft(d=>({...d,focus:e.target.value}))} placeholder="What does this reveal about God?" maxLength={120}/></div>
      {!casc?(<div style={{display:"flex",gap:6}}><button style={{background:T.gold,color:"#1a1a2e",border:"none",borderRadius:18,padding:"7px 11px",fontSize:"0.72rem",fontWeight:"bold",cursor:"pointer",flex:1,opacity:draft.book.trim()?1:0.4}} onClick={()=>{if(!draft.book.trim())return;isLast?save(false):setCasc(true);}}>Save</button>{isCustom&&<button style={{background:"transparent",border:`1px solid ${T.border}`,color:T.muted,padding:"7px 11px",borderRadius:18,cursor:"pointer",fontSize:"0.66rem"}} onClick={resetD}>Reset</button>}</div>):(<div style={{background:"rgba(0,0,0,0.09)",border:`1px solid ${color}25`,borderRadius:T.rs,padding:"9px 10px"}}><div style={{color:T.text,fontSize:`${0.74*T.fs}rem`,fontWeight:"bold",marginBottom:2}}>Adjust the rest of the week?</div><div style={{color:T.muted,fontSize:`${0.68*T.fs}rem`,lineHeight:T.lh,marginBottom:8}}>Shift Days {di+2}-7, or save this day only.</div><div style={{display:"flex",flexDirection:"column",gap:5}}><button style={{background:T.gold,color:"#1a1a2e",border:"none",borderRadius:18,padding:"7px 11px",fontSize:"0.72rem",fontWeight:"bold",cursor:"pointer"}} onClick={()=>save(true)}>Yes - Adjust Days {di+2}-7</button><button style={{background:"transparent",border:`1px solid ${T.border}`,color:T.muted,padding:"7px 11px",borderRadius:18,cursor:"pointer",fontSize:"0.7rem"}} onClick={()=>save(false)}>No - This Day Only</button>{isCustom&&<button style={{background:"transparent",border:`1px solid ${T.wine}33`,color:T.wine,padding:"6px 11px",borderRadius:18,cursor:"pointer",fontSize:"0.66rem"}} onClick={resetF}>Reset Days {di+1}-7</button>}<button style={{background:"none",border:"none",color:T.faint,cursor:"pointer",fontSize:"0.66rem"}} onClick={()=>setCasc(false)}>Back</button></div></div>)}
    </div>)}
  </div>);
}

function ProgressScreen({checks,dA,dB,streak,nA,nB,setChecks,toast_,archiveWeek,hist}){
  const T=useT();
  const pA=Math.round(dA/7*100),pB=Math.round(dB/7*100);
  const flame=streak===0?"🕯️":streak<3?"🔥":streak<6?"🔥🔥":"🔥🔥🔥";
  const C={background:T.s2,border:`1px solid ${T.border}`,borderRadius:T.r,padding:"13px"};
  return(<div style={{flex:1,overflowY:"auto",padding:"20px 15px 86px",display:"flex",flexDirection:"column",gap:13}}>
    <h2 style={{fontFamily:T.hf,color:T.text,fontSize:"1.22rem",margin:0}}>Progress</h2>
    <div style={{background:T.id==="light"||T.id==="sepia"||T.id==="dyslexia"?T.s2:"linear-gradient(135deg,#1e0e06,#2a1400)",border:`1px solid ${T.gold}44`,borderRadius:T.r,padding:"16px 13px",textAlign:"center"}}><div style={{fontSize:"2rem"}}>{flame}</div><div style={{fontFamily:T.hf,fontSize:`${3*T.fs}rem`,color:T.gold,lineHeight:1}}>{streak}</div><div style={{color:T.muted,fontSize:"0.66rem",letterSpacing:2,textTransform:"uppercase",marginTop:3}}>Day Streak</div><div style={{color:T.faint,fontSize:"0.66rem",marginTop:4}}>{hist.length} week{hist.length!==1?"s":""} archived</div></div>
    <div style={C}><div style={{color:T.gold,fontFamily:T.hf,fontSize:"0.85rem",marginBottom:11}}>This Week</div>{[{name:nA,pct:pA,done:dA,color:T.gold},{name:nB,pct:pB,done:dB,color:T.sage}].map(r=>(<div key={r.name} style={{marginBottom:12}}><div style={{display:"flex",justifyContent:"space-between",fontSize:"0.74rem",marginBottom:4}}><span style={{color:T.mid}}>{r.name}</span><span style={{color:r.color}}>{r.done}/7 {r.pct}%</span></div><div style={{background:T.border,borderRadius:7,height:7,overflow:"hidden"}}><div style={{width:r.pct+"%",height:"100%",background:r.color,borderRadius:7,transition:"width 0.8s"}}/></div></div>))}</div>
    <div style={C}><div style={{color:T.gold,fontFamily:T.hf,fontSize:"0.85rem",marginBottom:11}}>Day-by-Day</div><div style={{display:"flex",gap:6,flexWrap:"wrap",justifyContent:"center"}}>{DAYS.map((d,i)=>{const a=checks[`${i}-a`],b=checks[`${i}-b`];const bg=(a&&b)?T.gold:a?T.gold+"88":b?T.sage+"88":T.s2;return(<div key={i} style={{textAlign:"center",display:"flex",flexDirection:"column",alignItems:"center",gap:3}}><div style={{width:34,height:34,borderRadius:"50%",background:bg,border:`1px solid ${T.border}`,display:"flex",alignItems:"center",justifyContent:"center",color:(a||b)?"white":T.muted,fontSize:"0.68rem",fontWeight:"bold"}}>{(a||b)?"✓":d.day}</div><div style={{color:T.faint,fontSize:"0.54rem"}}>{d.name.slice(0,3)}</div></div>);})}</div></div>
    <div style={{background:T.gold+"0d",border:`1px solid ${T.gold}30`,borderRadius:T.r,padding:"12px 13px"}}><div style={{color:T.gold,fontFamily:T.hf,fontSize:"0.84rem",marginBottom:4}}>Archive This Week</div><p style={{color:T.muted,fontSize:"0.7rem",lineHeight:T.lh,marginBottom:9}}>Save this week to Growth history and start fresh. Records are kept forever.</p><button style={{background:T.gold,color:"#1a1a2e",border:"none",borderRadius:18,padding:"8px 16px",fontWeight:"bold",cursor:"pointer",fontSize:"0.78rem"}} onClick={()=>{archiveWeek(checks);setChecks({});toast_("Week archived and reset!");}}>Archive and Start New Week</button></div>
  </div>);
}

function NotesScreen({notes,setNotes,nA,nB,au}){
  const T=useT();
  const[active,setActive]=useState(au);
  const isOwn=active===au,color=active==="a"?T.gold:T.sage;
  const saveNote=(side,val)=>{const n={...notes,[side]:val};setNotes(n);LS.set("br_notes",n);};
  return(<div style={{flex:1,overflowY:"auto",padding:"20px 15px 86px",display:"flex",flexDirection:"column",gap:13}}>
    <h2 style={{fontFamily:T.hf,color:T.text,fontSize:"1.22rem",margin:0}}>Reflection Notes</h2>
    <div style={{display:"flex",borderBottom:`1px solid ${T.border}`}}>{[{id:"a",nm:nA},{id:"b",nm:nB}].map(t=>(<button key={t.id} style={{flex:1,background:"none",border:"none",borderBottom:`2px solid ${active===t.id?(t.id==="a"?T.gold:T.sage):"transparent"}`,color:active===t.id?(t.id==="a"?T.gold:T.sage):T.muted,padding:"8px",cursor:"pointer",fontSize:"0.81rem"}} onClick={()=>setActive(t.id)}>{t.id==="a"?"📒":"📗"} {t.nm}</button>))}</div>
    <div style={{background:T.s2,border:`1px solid ${T.border}`,borderRadius:T.r,padding:13}}><label style={{color:T.muted,fontSize:"0.7rem",display:"block",marginBottom:6}}>{active==="a"?nA:nB} reflections {!isOwn&&<span style={{color:T.wine,marginLeft:5,fontSize:"0.63rem"}}>👁 View only</span>}</label><textarea style={{width:"100%",background:T.ib,border:`1px solid ${color}30`,borderRadius:T.rs,color:T.text,padding:9,fontFamily:T.hf,fontSize:`${0.83*T.fs}rem`,lineHeight:T.lh,resize:"vertical",outline:"none",minHeight:145}} value={notes[active]} onChange={isOwn?e=>saveNote(active,e.target.value):undefined} readOnly={!isOwn} placeholder={isOwn?"Write what stood out, what you are praying about...":active==="a"?`${nA} has not written yet.`:`${nB} has not written yet.`} rows={6}/><div style={{color:T.faint,fontSize:"0.62rem",textAlign:"right",marginTop:3}}>{notes[active].length} chars</div></div>
    {isOwn&&(<div style={{background:color+"07",border:`1px solid ${color}20`,borderRadius:T.r,padding:"11px 13px"}}><div style={{color,fontSize:"0.7rem",letterSpacing:1,marginBottom:7}}>Reflection prompts</div>{["What did God reveal about Himself today?","How can I apply this passage this week?","What verse stood out and why?","What is God asking me to surrender?"].map((p,i)=>(<div key={i} style={{color:T.muted,fontSize:"0.74rem",marginBottom:4,fontStyle:"italic"}}>· {p}</div>))}</div>)}
  </div>);
}


function QuizScreen({nA,nB,au,toast_}){
  const T=useT();
  const myName=au==="a"?nA:nB,myC=au==="a"?T.gold:T.sage;
  const[scores,setScores]=useState(()=>LS.get("br_quiz",{a:{best:0,total:0,played:0},b:{best:0,total:0,played:0}}));
  const[phase,setPhase]=useState("lobby");
  const[cat,setCat]=useState("This Week");
  const[diffIdx,setDiffIdx]=useState(0);
  const[questions,setQuestions]=useState([]);
  const[qIdx,setQIdx]=useState(0);
  const[selected,setSelected]=useState(null);
  const[correct,setCorrect]=useState(null);
  const[score,setScore]=useState(0);
  const[streak,setStreak]=useState(0);
  const[best,setBest]=useState(0);
  const[timer,setTimer]=useState(20);
  const active=useRef(false);
  const timerRef=useRef(null);
  const scoreR=useRef(0),strkR=useRef(0),qIdxR=useRef(0),qRef=useRef([]),selR=useRef(null);
  useEffect(()=>LS.set("br_quiz",scores),[scores]);
  const finish=useCallback(fs=>{
    active.current=false;clearTimeout(timerRef.current);
    setPhase("result");
    setScores(p=>{const u=p[au];return{...p,[au]:{best:Math.max(u.best,fs),total:u.total+fs,played:u.played+1}};});
  },[au]);
  const advance=useCallback(()=>{
    const n=qIdxR.current+1;
    if(n>=qRef.current.length){finish(scoreR.current);}
    else{qIdxR.current=n;setQIdx(n);selR.current=null;setSelected(null);setCorrect(null);setTimer(20);active.current=true;}
  },[finish]);
  const handleAnswer=useCallback(idx=>{
    if(selR.current!==null)return;
    active.current=false;clearTimeout(timerRef.current);
    selR.current=idx;setSelected(idx);
    const q=qRef.current[qIdxR.current],ok=idx===q.a;
    setCorrect(ok);
    if(ok){scoreR.current++;strkR.current++;setScore(scoreR.current);setStreak(strkR.current);setBest(b=>Math.max(b,strkR.current));}
    else{strkR.current=0;setStreak(0);}
    setTimeout(advance,1400);
  },[advance]);
  useEffect(()=>{
    if(phase!=="playing")return;
    const tick=()=>{if(!active.current)return;setTimer(t=>{if(t<=1){handleAnswer(-1);return 0;}timerRef.current=setTimeout(tick,1000);return t-1;});};
    timerRef.current=setTimeout(tick,1000);
    return()=>clearTimeout(timerRef.current);
  },[phase,qIdx,handleAnswer]);
  const startQuiz=()=>{
    let pool;
    if(cat==="This Week")pool=buildPool(nA,nB);
    else if(cat==="All")pool=[...QB,...buildPool(nA,nB)];
    else pool=QB.filter(q=>q.c===cat);
    const picked=shuffle(pool).slice(0,Math.min(DC[diffIdx],pool.length));
    qRef.current=picked;qIdxR.current=0;scoreR.current=0;strkR.current=0;selR.current=null;
    setQuestions(picked);setQIdx(0);setScore(0);setStreak(0);setBest(0);setSelected(null);setCorrect(null);setTimer(20);
    active.current=true;setPhase("playing");
  };
  const C={background:T.s2,border:`1px solid ${T.border}`,borderRadius:T.r,padding:"13px"};
  if(phase==="lobby")return(<div style={{flex:1,overflowY:"auto",padding:"20px 15px 86px",display:"flex",flexDirection:"column",gap:13}}>
    <div style={{textAlign:"center"}}><div style={{color:T.gold,letterSpacing:3}}>✦ ✝ ✦</div><h2 style={{fontFamily:T.hf,color:T.text,fontSize:"1.22rem",margin:"5px 0 3px"}}>Bible Quiz</h2><p style={{color:T.muted,fontSize:"0.73rem"}}>Test your knowledge of God's Word</p></div>
    <div style={C}><div style={{color:T.gold,fontFamily:T.hf,fontSize:"0.83rem",marginBottom:9}}>Scoreboard</div>{[{id:"a",name:nA,s:scores.a},{id:"b",name:nB,s:scores.b}].map(p=>(<div key={p.id} style={{display:"flex",alignItems:"center",gap:9,marginBottom:7}}><div style={{width:32,height:32,borderRadius:"50%",background:(p.id==="a"?T.gold:T.sage)+"22",color:p.id==="a"?T.gold:T.sage,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:T.hf,fontWeight:"bold",flexShrink:0}}>{p.name[0]?.toUpperCase()}</div><div style={{flex:1}}><div style={{color:T.text,fontSize:`${0.81*T.fs}rem`,display:"flex",justifyContent:"space-between"}}><span>{p.name}</span><span style={{color:p.id==="a"?T.gold:T.sage,fontWeight:"bold"}}>Best: {p.s.best}</span></div><div style={{color:T.muted,fontSize:"0.64rem",marginTop:1}}>{p.s.played} game{p.s.played!==1?"s":""} {p.s.total} pts</div><div style={{background:T.border,borderRadius:4,height:4,marginTop:3,overflow:"hidden"}}><div style={{width:`${Math.min((p.s.best/DC[diffIdx])*100,100)}%`,height:"100%",background:p.id==="a"?T.gold:T.sage,borderRadius:4}}/></div></div></div>))}</div>
    <div style={C}><div style={{color:T.gold,fontFamily:T.hf,fontSize:"0.83rem",marginBottom:9}}>Category</div><div style={{display:"flex",flexWrap:"wrap",gap:5}}>{CATS.map(c=>{const act=cat===c;const isW=c==="This Week";return(<button key={c} style={{padding:"5px 11px",borderRadius:16,border:`${act?"2px":"1px"} solid ${act?myC:isW?T.gold+"55":T.border}`,background:act?myC+"1e":isW?T.gold+"09":T.ib,color:act?myC:isW?T.gold:T.muted,cursor:"pointer",fontSize:"0.72rem",display:"flex",alignItems:"center",gap:3}} onClick={()=>setCat(c)}>{isW&&"📖"}{c}</button>);})} </div></div>
    <div style={C}><div style={{color:T.gold,fontFamily:T.hf,fontSize:"0.83rem",marginBottom:9}}>Difficulty</div><div style={{display:"flex",gap:6}}>{DIFFS.map((d,i)=><button key={d} style={{flex:1,padding:"6px 4px",borderRadius:T.rs,border:`1px solid ${diffIdx===i?myC:T.border}`,background:diffIdx===i?myC+"1e":T.ib,color:diffIdx===i?myC:T.muted,cursor:"pointer",fontSize:"0.7rem",textAlign:"center"}} onClick={()=>setDiffIdx(i)}>{d}</button>)}</div></div>
    <button style={{background:myC,color:"#1a1a2e",border:"none",borderRadius:20,padding:"12px",fontSize:`${0.88*T.fs}rem`,fontWeight:"bold",cursor:"pointer"}} onClick={startQuiz}>Start Quiz — {myName}</button>
  </div>);
  if(phase==="playing"&&questions.length>0){
    const q=questions[qIdx];if(!q)return null;
    const tP=(timer/20)*100,tC=timer>10?T.sage:timer>5?T.gold:T.wine;
    return(<div style={{flex:1,overflowY:"auto",padding:"13px 14px 86px",display:"flex",flexDirection:"column",gap:11}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><div style={{color:T.muted,fontSize:"0.7rem"}}>Q {qIdx+1}/{questions.length}</div><div style={{display:"flex",gap:6}}><span style={{color:T.gold,fontSize:"0.73rem"}}>🔥 {streak}</span><span style={{color:myC,fontSize:"0.73rem",fontWeight:"bold"}}>{score} pts</span></div><div style={{color:tC,fontSize:"0.8rem",fontWeight:"bold"}}>{timer}s</div></div>
      <div style={{background:T.border,borderRadius:4,height:4,overflow:"hidden"}}><div style={{width:`${(qIdx/questions.length)*100}%`,height:"100%",background:myC,borderRadius:4,transition:"width 0.4s"}}/></div>
      <div style={{background:T.border,borderRadius:3,height:3,overflow:"hidden"}}><div style={{width:`${tP}%`,height:"100%",background:tC,borderRadius:3,transition:"width 1s linear"}}/></div>
      <div style={{display:"flex",gap:5,flexWrap:"wrap"}}><span style={{background:myC+"1e",color:myC,fontSize:"0.58rem",padding:"2px 6px",borderRadius:8,letterSpacing:1}}>{q.tag?"THIS WEEK":q.c?.toUpperCase()}</span>{q.tag&&<span style={{background:T.s2,color:T.muted,fontSize:"0.58rem",padding:"2px 6px",borderRadius:8}}>{q.tag}</span>}<span style={{color:T.faint,fontSize:"0.6rem"}}>{q.r}</span></div>
      <div style={{background:T.s2,border:`1px solid ${T.border}`,borderRadius:T.r,padding:"16px 14px",textAlign:"center"}}><p style={{color:T.text,fontFamily:T.hf,fontSize:`${0.97*T.fs}rem`,lineHeight:T.lh,margin:0}}>{q.q}</p></div>
      <div style={{display:"flex",flexDirection:"column",gap:7}}>{q.o.map((opt,i)=>{let bg=T.ib,border=T.border,color=T.text;if(selected!==null){if(i===q.a){bg=T.sage+"28";border=T.sage;color=T.sage;}else if(i===selected&&!correct){bg=T.wine+"28";border=T.wine;color=T.wine;}}return(<button key={i} style={{background:bg,border:`2px solid ${border}`,borderRadius:T.r,padding:"10px 13px",color,fontSize:`${0.86*T.fs}rem`,cursor:selected===null?"pointer":"default",textAlign:"left",display:"flex",alignItems:"center",gap:9,lineHeight:T.lh}} onClick={()=>handleAnswer(i)} disabled={selected!==null}><span style={{width:22,height:22,borderRadius:"50%",border:`2px solid ${border}`,background:selected!==null&&i===q.a?T.sage:selected===i&&!correct?T.wine:"transparent",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.68rem",fontWeight:"bold",flexShrink:0,color:selected!==null&&(i===q.a||i===selected)?"white":T.muted}}>{selected===null?String.fromCharCode(65+i):i===q.a?"✓":i===selected?"✗":String.fromCharCode(65+i)}</span>{opt}</button>);})}</div>
      {selected!==null&&(<div style={{textAlign:"center",padding:"8px",background:correct?T.sage+"1e":T.wine+"1e",borderRadius:T.rs,border:`1px solid ${correct?T.sage:T.wine}30`}}><div style={{color:correct?T.sage:T.wine,fontWeight:"bold",fontSize:`${0.84*T.fs}rem`}}>{correct?"Correct!":"Incorrect"}</div>{!correct&&<div style={{color:T.muted,fontSize:"0.7rem",marginTop:2}}>Answer: {q.o[q.a]}</div>}<div style={{color:T.faint,fontSize:"0.64rem",marginTop:1}}>{q.r}</div></div>)}
    </div>);
  }
  const total=questions.length||1,pct=Math.round((score/total)*100);
  const medal=pct===100?"🏆":pct>=80?"🥇":pct>=60?"🥈":pct>=40?"🥉":"📖";
  const msg=pct===100?"Perfect score! God's Word lives in you!":pct>=80?"Excellent! You know Scripture well.":pct>=60?"Good work — keep reading and growing!":pct>=40?"A solid start — every day in the Word helps!":"Keep studying — His Word is alive and powerful!";
  return(<div style={{flex:1,overflowY:"auto",padding:"20px 15px 86px",display:"flex",flexDirection:"column",gap:13,alignItems:"center"}}>
    <div style={{textAlign:"center"}}><div style={{fontSize:"3rem",marginBottom:6}}>{medal}</div><h2 style={{fontFamily:T.hf,color:myC,fontSize:"1.8rem",margin:0}}>{score}/{total}</h2><div style={{color:T.gold,fontSize:"0.92rem",marginTop:2}}>{pct}%</div><p style={{color:T.mid,fontFamily:T.hf,fontStyle:"italic",fontSize:"0.83rem",marginTop:8,lineHeight:T.lh,padding:"0 5px"}}>{msg}</p></div>
    <div style={{display:"flex",gap:8,width:"100%"}}>{[{ic:"🎯",v:score,lb:"Correct"},{ic:"🔥",v:best,lb:"Best Streak"},{ic:"⏱",v:`${pct}%`,lb:"Score"}].map(s=>(<div key={s.lb} style={{flex:1,background:T.s2,border:`1px solid ${T.border}`,borderRadius:T.r,padding:"10px 6px",textAlign:"center"}}><div style={{fontSize:"1.1rem"}}>{s.ic}</div><div style={{color:myC,fontFamily:T.hf,fontSize:"1.3rem",lineHeight:1}}>{s.v}</div><div style={{color:T.muted,fontSize:"0.58rem",textTransform:"uppercase",letterSpacing:1,marginTop:2}}>{s.lb}</div></div>))}</div>
    <div style={{background:T.s2,border:`1px solid ${T.border}`,borderRadius:T.r,padding:"12px 13px",width:"100%"}}><div style={{color:T.gold,fontFamily:T.hf,fontSize:"0.83rem",marginBottom:9}}>Head to Head</div>{[{id:"a",name:nA,s:scores.a},{id:"b",name:nB,s:scores.b}].map(p=>(<div key={p.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}><span style={{color:p.id===au?myC:T.mid,fontSize:"0.8rem",fontWeight:p.id===au?"bold":"normal"}}>{p.name}{p.id===au?" ✦":""}</span><span style={{color:p.id==="a"?T.gold:T.sage,fontWeight:"bold",fontSize:"0.8rem"}}>Best: {p.s.best} {p.s.played}g</span></div>))}</div>
    <div style={{display:"flex",flexDirection:"column",gap:8,width:"100%"}}><button style={{background:myC,color:"#1a1a2e",border:"none",borderRadius:20,padding:"11px",fontSize:`${0.86*T.fs}rem`,fontWeight:"bold",cursor:"pointer"}} onClick={startQuiz}>Play Again</button><button style={{background:"transparent",border:`1px solid ${T.border}`,color:T.muted,borderRadius:20,padding:"9px",fontSize:"0.78rem",cursor:"pointer"}} onClick={()=>setPhase("lobby")}>Back to Lobby</button></div>
  </div>);
}

function GrowthScreen({hist,nA,nB}){
  const T=useT();
  const n=hist.length;
  const pA=n?Math.round(hist.reduce((s,w)=>s+w.doneA,0)/n*10)/10:0;
  const pB=n?Math.round(hist.reduce((s,w)=>s+w.doneB,0)/n*10)/10:0;
  const bS=n?Math.max(...hist.map(w=>w.streak)):0;
  const C={background:T.s2,border:`1px solid ${T.border}`,borderRadius:T.r,padding:"13px"};
  if(!n)return(<div style={{flex:1,overflowY:"auto",padding:"20px 15px 86px",display:"flex",flexDirection:"column",gap:13,alignItems:"center",justifyContent:"center"}}><div style={{textAlign:"center",padding:"24px 14px"}}><div style={{fontSize:"2.6rem",marginBottom:9}}>🌱</div><h2 style={{fontFamily:T.hf,color:T.text,fontSize:"1.18rem",margin:"0 0 7px"}}>Your Growth Journey</h2><p style={{color:T.muted,fontSize:"0.77rem",lineHeight:T.lh}}>Complete your first week then tap <strong style={{color:T.gold}}>Archive and Start New Week</strong> in Progress to begin tracking.</p><div style={{marginTop:14,...C,textAlign:"left"}}><div style={{color:T.gold,fontSize:"0.73rem",fontWeight:"bold",marginBottom:6}}>What gets tracked:</div>{["📖 Days read per track","🔥 Best streak","🎯 Quiz high scores","🏆 Perfect week achievements","📅 Week date"].map((l,i)=><div key={i} style={{color:T.muted,fontSize:"0.71rem",marginBottom:2}}>{l}</div>)}</div></div></div>);
  return(<div style={{flex:1,overflowY:"auto",padding:"20px 15px 86px",display:"flex",flexDirection:"column",gap:13}}>
    <div><h2 style={{fontFamily:T.hf,color:T.text,fontSize:"1.22rem",margin:"0 0 3px"}}>Growth Journey</h2><p style={{color:T.muted,fontSize:"0.7rem",margin:0}}>{n} week{n!==1?"s":""} tracked</p></div>
    <div style={C}><div style={{color:T.gold,fontFamily:T.hf,fontSize:"0.83rem",marginBottom:11}}>All-Time Summary</div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7}}>{[{ic:"📅",lb:"Weeks",v:n,c:T.gold},{ic:"🔥",lb:"Best Streak",v:`${bS}d`,c:T.gold},{ic:"📖",lb:`${nA} Avg`,v:`${pA}/7`,c:T.gold},{ic:"📗",lb:`${nB} Avg`,v:`${pB}/7`,c:T.sage},{ic:"🏅",lb:`${nA} Perfect`,v:hist.filter(w=>w.pA).length,c:T.gold},{ic:"🏅",lb:`${nB} Perfect`,v:hist.filter(w=>w.pB).length,c:T.sage},{ic:"🎯",lb:`${nA} Quiz`,v:n?Math.max(...hist.map(w=>w.qA)):0,c:T.gold},{ic:"🎯",lb:`${nB} Quiz`,v:n?Math.max(...hist.map(w=>w.qB)):0,c:T.sage}].map(s=>(<div key={s.lb} style={{background:T.ib,border:`1px solid ${T.border}`,borderRadius:T.rs,padding:"8px 10px"}}><div style={{fontSize:"0.9rem",marginBottom:2}}>{s.ic}</div><div style={{color:s.c,fontFamily:T.hf,fontSize:`${1.1*T.fs}rem`,fontWeight:"bold",lineHeight:1}}>{s.v}</div><div style={{color:T.faint,fontSize:"0.58rem",marginTop:2,textTransform:"uppercase",letterSpacing:0.4}}>{s.lb}</div></div>))}</div></div>
    <div style={C}><div style={{color:T.gold,fontFamily:T.hf,fontSize:"0.83rem",marginBottom:11}}>Week-by-Week</div>{hist.slice().reverse().map((w)=>(<div key={w.id} style={{marginBottom:13}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}><div style={{display:"flex",alignItems:"center",gap:5}}><span style={{color:T.gold,fontFamily:T.hf,fontSize:"0.78rem"}}>Week {w.weekNum}</span>{w.pA&&w.pB&&<span style={{fontSize:"0.66rem"}}>🏆</span>}{w.streak===7&&<span style={{fontSize:"0.66rem"}}>🔥</span>}</div><span style={{color:T.faint,fontSize:"0.63rem"}}>{w.date}</span></div>{[{name:nA,done:w.doneA,pf:w.pA,c:T.gold},{name:nB,done:w.doneB,pf:w.pB,c:T.sage}].map(r=>(<div key={r.name} style={{marginBottom:5}}><div style={{display:"flex",justifyContent:"space-between",fontSize:"0.63rem",marginBottom:2}}><span style={{color:r.c}}>{r.name}</span><span style={{color:r.c}}>{r.done}/7{r.pf?" ✓":""}</span></div><div style={{background:T.border,borderRadius:4,height:5,overflow:"hidden"}}><div style={{width:`${Math.round(r.done/7*100)}%`,height:"100%",background:r.c,borderRadius:4}}/></div></div>))}<div style={{display:"flex",gap:9,marginTop:2}}><span style={{color:T.faint,fontSize:"0.6rem"}}>🔥 {w.streak}</span><span style={{color:T.faint,fontSize:"0.6rem"}}>🎯 {nA.split(" ")[0]}: {w.qA} {nB.split(" ")[0]}: {w.qB}</span></div></div>))}</div>
    <div style={{background:T.gold+"0d",border:`1px solid ${T.gold}2d`,borderRadius:T.r,padding:"11px 12px",textAlign:"center"}}><div style={{fontSize:"1.2rem",marginBottom:4}}>🌿</div><p style={{color:T.mid,fontFamily:T.hf,fontStyle:"italic",fontSize:`${0.8*T.fs}rem`,lineHeight:T.lh,margin:0}}>Let us not become weary in doing good, for at the proper time we will reap a harvest.</p><div style={{color:T.gold,fontSize:"0.65rem",marginTop:4}}>Galatians 6:9</div></div>
  </div>);
}

function SettingsScreen({names,au,setAu,toast_,setChecks,setNotes,setMsgs,setCR,tid,setTid,archiveWeek,checks,setHist,fullReset}){
  const T=useT();
  const[conf,setConf]=useState(null);
  const C={background:T.s2,border:`1px solid ${T.border}`,borderRadius:T.r,padding:"13px"};
  const RESETS=[
    {id:"archive",label:"Archive and Reset Week",     desc:"Saves this week to Growth history and clears reading progress.",fn:()=>{archiveWeek(checks);setChecks({});toast_("Week archived and reset!");}},
    {id:"notes",  label:"Clear All Notes",            desc:"Permanently deletes your reflection notes.",                  fn:()=>{setNotes({a:"",b:""});toast_("Notes cleared.");}},
    {id:"reads",  label:"Reset Custom Readings",      desc:"Restores all edited readings back to the default timetable.",  fn:()=>{setCR({});toast_("Readings reset.");}},
    {id:"growth", label:"Clear Growth History",       desc:"Permanently deletes all archived weeks. Cannot be undone.",   fn:()=>{setHist([]);toast_("Growth history cleared.");}},
    {id:"full",   label:"Full Reset (Start Over)",    desc:"Wipes everything including names. Returns to onboarding.",    fn:fullReset,danger:true},
  ];
  return(<div style={{flex:1,overflowY:"auto",padding:"20px 15px 86px",display:"flex",flexDirection:"column",gap:13}}>
    <h2 style={{fontFamily:T.hf,color:T.text,fontSize:"1.22rem",margin:0}}>Settings</h2>
    <div style={{...C,borderColor:T.gold+"33"}}><div style={{color:T.gold,fontFamily:T.hf,fontSize:"0.83rem",marginBottom:3}}>Reading tracks</div><p style={{color:T.faint,fontSize:"0.68rem",marginBottom:9,lineHeight:T.lh}}>Names are set once at setup. A full reset is required to change them.</p><div style={{display:"flex",gap:8}}>{[{name:names.a,color:T.gold},{name:names.b,color:T.sage}].map((p,i)=>(<div key={i} style={{flex:1,background:p.color+"0d",border:`1px solid ${p.color}44`,borderRadius:T.rs,padding:"8px 10px",display:"flex",alignItems:"center",gap:6}}><div style={{width:28,height:28,borderRadius:"50%",background:p.color+"22",color:p.color,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:T.hf,fontWeight:"bold",flexShrink:0}}>{p.name[0]?.toUpperCase()}</div><div style={{flex:1,minWidth:0}}><div style={{color:T.text,fontFamily:T.hf,fontSize:"0.83rem",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p.name}</div><div style={{color:T.faint,fontSize:"0.58rem"}}>Track {i===0?"A":"B"}</div></div><span style={{color:T.faint,fontSize:"0.74rem"}}>🔒</span></div>))}</div></div>
    <div style={C}><div style={{color:T.gold,fontFamily:T.hf,fontSize:"0.83rem",marginBottom:3}}>Display Theme</div><p style={{color:T.muted,fontSize:"0.7rem",marginBottom:11,lineHeight:T.lh}}>Choose a theme that works best for you.</p><div style={{display:"flex",flexDirection:"column",gap:6}}>{Object.values(THEMES).map(th=>(<button key={th.id} style={{display:"flex",alignItems:"center",gap:9,padding:"9px 11px",borderRadius:T.rs,border:`${tid===th.id?"2px":"1px"} solid ${tid===th.id?T.gold:T.border}`,background:tid===th.id?T.gold+"18":T.ib,cursor:"pointer",textAlign:"left"}} onClick={()=>{setTid(th.id);toast_(`Theme: ${th.label}`);}}><span style={{fontSize:"1.2rem",flexShrink:0}}>{th.icon}</span><div style={{flex:1}}><div style={{color:tid===th.id?T.gold:T.text,fontWeight:"bold",fontSize:`${0.83*T.fs}rem`}}>{th.label}</div><div style={{color:T.muted,fontSize:"0.65rem",marginTop:1,lineHeight:1.3}}>{th.desc}</div></div>{tid===th.id&&<span style={{color:T.gold}}>✓</span>}</button>))}</div></div>
    <div style={C}><div style={{color:T.gold,fontFamily:T.hf,fontSize:"0.83rem",marginBottom:9}}>Switch Reader</div><p style={{color:T.muted,fontSize:"0.73rem",marginBottom:9}}>Reading as <strong style={{color:au==="a"?T.gold:T.sage}}>{au==="a"?names.a:names.b}</strong></p><button style={{background:"transparent",border:`1px solid ${au==="a"?T.sage:T.gold}`,color:au==="a"?T.sage:T.gold,borderRadius:20,padding:"8px 16px",cursor:"pointer",width:"100%",fontWeight:"bold",fontSize:"0.81rem"}} onClick={()=>{setAu(au==="a"?"b":"a");toast_(`Switched to ${au==="a"?names.b:names.a}`);}}>Switch to {au==="a"?names.b:names.a}</button></div>
    <div style={{...C,borderColor:T.wine+"44"}}><div style={{color:T.wine,fontFamily:T.hf,fontSize:"0.83rem",marginBottom:11}}>Reset Options</div>
      <div style={{display:"flex",flexDirection:"column",gap:7}}>{RESETS.map(r=>(<div key={r.id}>{conf!==r.id?(<button style={{background:"transparent",border:`1px solid ${r.danger?T.wine+"44":T.border}`,color:r.danger?T.wine:T.muted,padding:"8px 13px",borderRadius:18,cursor:"pointer",fontSize:"0.71rem",textAlign:"left",width:"100%",display:"flex",justifyContent:"space-between",alignItems:"center"}} onClick={()=>setConf(r.id)}><span>{r.label}</span><span style={{opacity:0.5}}>›</span></button>):(<div style={{background:r.danger?T.wine+"0d":T.s2,border:`1px solid ${r.danger?T.wine+"44":T.border}`,borderRadius:T.rs,padding:"10px 11px"}}><div style={{color:r.danger?T.wine:T.text,fontWeight:"bold",fontSize:`${0.78*T.fs}rem`,marginBottom:3}}>{r.label}</div><p style={{color:T.muted,fontSize:"0.69rem",lineHeight:T.lh,margin:"0 0 9px"}}>{r.desc}</p><div style={{display:"flex",gap:6}}><button style={{flex:1,background:r.danger?T.wine:T.gold,color:"white",border:"none",borderRadius:18,padding:"7px",cursor:"pointer",fontWeight:"bold",fontSize:"0.73rem"}} onClick={()=>{r.fn();setConf(null);}}>{r.danger?"Yes, Reset Everything":"Confirm"}</button><button style={{flex:1,background:"transparent",border:`1px solid ${T.border}`,color:T.muted,borderRadius:18,padding:"7px",cursor:"pointer",fontSize:"0.73rem"}} onClick={()=>setConf(null)}>Cancel</button></div></div>)}</div>))}</div>
      <p style={{color:T.faint,fontSize:"0.64rem",marginTop:11,lineHeight:T.lh}}>Full Reset is the only way to change track names.</p>
    </div>
  </div>);
}

function BottomNav({tab,setTab}){
  const T=useT();
  const items=[{id:"home",ic:"🏠",lb:"Home"},{id:"schedule",ic:"📖",lb:"Schedule"},{id:"quiz",ic:"🎯",lb:"Quiz"},{id:"growth",ic:"📈",lb:"Growth"},{id:"settings",ic:"⚙️",lb:"Settings"}];
  return(<nav style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:430,background:T.bg,borderTop:`1px solid ${T.border}`,display:"flex",zIndex:50,padding:"4px 0 7px"}}>
    {items.map(t=>(<button key={t.id} style={{flex:1,background:"none",border:"none",display:"flex",flexDirection:"column",alignItems:"center",gap:1,cursor:"pointer",padding:"3px 0",position:"relative"}} onClick={()=>setTab(t.id)} aria-current={tab===t.id?"page":undefined}>
      <div style={{position:"relative",display:"inline-block"}}><span style={{fontSize:"0.92rem"}}>{t.ic}</span>{t.badge>0&&<span style={{position:"absolute",top:-4,right:-6,background:T.wine,color:"white",borderRadius:"50%",width:13,height:13,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.48rem",fontWeight:"bold"}}>{t.badge}</span>}</div>
      <span style={{fontSize:"0.48rem",letterSpacing:0.3,color:tab===t.id?T.gold:T.faint,textTransform:"uppercase"}}>{t.lb}</span>
      {tab===t.id&&<span style={{width:3,height:3,borderRadius:"50%",background:T.gold,position:"absolute",bottom:0}}/>}
    </button>))}
  </nav>);
}
