const translations={
  en:{
    navHome:"Home",navAbout:"About Busan",navTours:"Tours",navPlanner:"Planner",
    heroEyebrow:"South Korea’s ocean city",
    heroCopy:"Beaches, night views, markets, and slow coastal walks. Make your first Busan trip simple and memorable.",
    watchTour:"Watch tour",makePlan:"Make my route",learnMore:"Learn more",
    aboutLabel:"About Busan",aboutTitle:"A city where the sea meets everyday life.",
    introTitle1:"Ocean view",introDesc1:"Haeundae and Gwangalli are easy places to start your Busan trip.",
    introTitle2:"Local food",introDesc2:"Try fish cake, milmyeon, seafood, and market snacks.",
    introTitle3:"Photo spots",introDesc3:"Find colorful streets, bridges, temples, and night views.",
    tourLabel:"Recommended tours",tourTitle:"Pick your Busan mood",autoPlay:"Auto play",stop:"Stop",
    plannerLabel:"Trip planner",plannerTitle:"Build a simple one-day Busan route.",
    plannerCopy:"Choose a travel mood and get a short course recommendation. This form also includes validation for the project checklist.",
    nameLabel:"Name",moodLabel:"Travel mood",selectMood:"Select one",moodOcean:"Ocean view",moodFood:"Food & market",moodPhoto:"Photo spots",
    submit:"Recommend route",backTop:"Back to top",loading:"Loading Busan tour data...",
    error:"Tour data could not be loaded. Please open this page with Live Server.",
    started:"Auto tour highlight started.",stopped:"Auto tour highlight stopped.",
    formError:"Please enter your name and select a travel mood.",resultPrefix:"Recommended route for ",
    oceanRoute:"Haeundae Beach → Dongbaekseom → Gwangalli night view",
    foodRoute:"Jagalchi Market → BIFF Square → Gukje Market",
    photoRoute:"Gamcheon Culture Village → Huinnyeoul Culture Village → Busan X the Sky"
  },
  kr:{
    navHome:"홈",navAbout:"부산 소개",navTours:"추천 코스",navPlanner:"여행 계획",
    heroEyebrow:"대한민국의 바다 도시",
    heroCopy:"해변, 야경, 시장, 느린 해안 산책까지. 첫 부산 여행을 쉽고 기억에 남게 만들어보세요.",
    watchTour:"코스 보기",makePlan:"내 코스 만들기",learnMore:"더 알아보기",
    aboutLabel:"부산 소개",aboutTitle:"바다와 일상이 자연스럽게 만나는 도시.",
    introTitle1:"오션뷰",introDesc1:"해운대와 광안리는 부산 여행을 시작하기 좋은 대표 명소입니다.",
    introTitle2:"로컬 푸드",introDesc2:"어묵, 밀면, 해산물, 시장 간식을 즐겨보세요.",
    introTitle3:"포토 스팟",introDesc3:"컬러풀한 마을, 다리, 사찰, 야경 명소를 만날 수 있습니다.",
    tourLabel:"추천 여행",tourTitle:"내 취향에 맞는 부산 고르기",autoPlay:"자동 재생",stop:"정지",
    plannerLabel:"여행 계획",plannerTitle:"간단한 부산 하루 코스 만들기.",
    plannerCopy:"여행 취향을 선택하면 짧은 추천 코스가 나타납니다. 과제 체크리스트에 맞춰 폼 유효성 검사도 포함했습니다.",
    nameLabel:"이름",moodLabel:"여행 취향",selectMood:"하나 선택",moodOcean:"오션뷰",moodFood:"음식과 시장",moodPhoto:"포토 스팟",
    submit:"코스 추천받기",backTop:"맨 위로",loading:"부산 여행 데이터를 불러오는 중입니다...",
    error:"여행 데이터를 불러오지 못했습니다. Live Server로 열어주세요.",
    started:"자동 코스 하이라이트가 시작되었습니다.",stopped:"자동 코스 하이라이트가 정지되었습니다.",
    formError:"이름과 여행 취향을 모두 입력해주세요.",resultPrefix:"",
    oceanRoute:"해운대 해수욕장 → 동백섬 → 광안리 야경",
    foodRoute:"자갈치시장 → BIFF 광장 → 국제시장",
    photoRoute:"감천문화마을 → 흰여울문화마을 → 부산엑스더스카이"
  }
};

let currentLang="en",tours=[],activeIndex=0,autoTimer=null;

const langToggle=document.querySelector("#langToggle");
const menuToggle=document.querySelector("#menuToggle");
const navMenu=document.querySelector("#navMenu");
const tourGrid=document.querySelector("#tourGrid");
const statusText=document.querySelector("#status");
const startAuto=document.querySelector("#startAuto");
const stopAuto=document.querySelector("#stopAuto");
const planForm=document.querySelector("#planForm");
const formMessage=document.querySelector("#formMessage");

function t(k){return translations[currentLang][k]||k}

function applyLanguage(lang){
  currentLang=lang;
  document.documentElement.lang=lang==="kr"?"ko":"en";
  document.querySelectorAll("[data-i18n]").forEach(el=>el.textContent=t(el.dataset.i18n));
  langToggle.textContent=lang==="en"?"EN / KR":"KR / EN";
  renderTours();
}

function renderTours(){
  if(!tourGrid||!tours.length)return;
  tourGrid.innerHTML="";
  tours.forEach((tour,index)=>{
    const card=document.createElement("article");
    card.className="tour-card";
    if(index===activeIndex)card.classList.add("is-active");
    const title=tour[currentLang].title;
    const desc=tour[currentLang].description;
    const tag=tour[currentLang].tag;
    card.innerHTML=`<div class="tour-card__image" style="background-image:url('${tour.image}')" role="img" aria-label="${title}"></div><div class="tour-card__content"><span class="tour-card__tag">${tag}</span><h3>${title}</h3><p>${desc}</p></div>`;
    tourGrid.appendChild(card);
  });
}

async function loadTours(){
  try{
    statusText.textContent=t("loading");
    const response=await fetch("busan-tours.json");
    if(!response.ok)throw new Error("Fetch failed");
    tours=await response.json();
    renderTours();
    setTimeout(()=>{statusText.textContent=""},1200);
  }catch(error){
    console.error(error);
    statusText.textContent=t("error");
  }
}

function startAutoPlay(){
  clearInterval(autoTimer);
  autoTimer=setInterval(()=>{
    if(!tours.length)return;
    activeIndex=(activeIndex+1)%tours.length;
    renderTours();
  },3000);
  statusText.textContent=t("started");
  setTimeout(()=>{statusText.textContent=""},1400);
}

function stopAutoPlay(){
  clearInterval(autoTimer);
  statusText.textContent=t("stopped");
  setTimeout(()=>{statusText.textContent=""},1400);
}

function handleFormSubmit(e){
  e.preventDefault();
  const name=document.querySelector("#travelerName").value.trim();
  const mood=document.querySelector("#mood").value;
  if(!name||!mood){
    formMessage.textContent=t("formError");
    formMessage.classList.add("is-error");
    return;
  }
  const routeMap={ocean:"oceanRoute",food:"foodRoute",photo:"photoRoute"};
  formMessage.classList.remove("is-error");
  formMessage.textContent=currentLang==="kr"?`${name}님 추천 코스: ${t(routeMap[mood])}`:`${t("resultPrefix")}${name}: ${t(routeMap[mood])}`;
}

langToggle.addEventListener("click",()=>applyLanguage(currentLang==="en"?"kr":"en"));
menuToggle.addEventListener("click",()=>navMenu.classList.toggle("is-open"));
startAuto.addEventListener("click",startAutoPlay);
stopAuto.addEventListener("click",stopAutoPlay);
planForm.addEventListener("submit",handleFormSubmit);

applyLanguage("en");
loadTours();
startAutoPlay();