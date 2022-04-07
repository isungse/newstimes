let news = [];
let page = 1;
let total_pages = 0;
let menus = document.querySelectorAll(".menus button");
menus.forEach((menu) =>
  menu.addEventListener("click", (event) => getNewsByTopic(event))
);

let searchButton = document.getElementById("search-button");
let url;

//각 함수에 필요한 url를 만든다
//api 호출 함수를 부른다.

const getNews = async () => {
  try {
    let header = new Headers({
      "x-api-key": "PaZnGf3IrT8m6pNRgc_4Fur0A4b832p4nFU-ts1Tgmw",
    });
    url.searchParams.set("page", page); //&page=
    console.log("url은?", url);
    let response = await fetch(url, { headers: header });
    let data = await response.json();
    if (response.status == 200) {
      if (data.total_hits == 0) {
        throw new Error("검색된 결과값이 없습니다.");
      }
      console.log("받는 데이터가 뭐지?", data);
      news = data.articles;
      total_pages = data.total_pages;
      page = data.page;
      console.log(news);
      render();
      pagenation();
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.log("잡힌 에러는", error.message);
    errorRender(error.message);
  }
};

const getLatestNews = async () => {
  url = new URL(
    "https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&topic=sport&page_size=10"
  );
  getNews();
};

const getNewsByTopic = async (event) => {
  console.log("클릭됨", event.target.textContent);
  let topic = event.target.textContent.toLowerCase();

  url = new URL(
    `https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&page_size=10&topic=${topic}`
  );
  getNews();
};

const getNewsBykeyword = async () => {
  // 검색 키워드 읽어오기
  // url에 검색 키워드 부치기
  // 헤더준비
  // url 부루기
  // 데이터 가져오기
  // 데이터 보여주기

  let keyword = document.getElementById("search-input").value;
  url = new URL(
    `https://api.newscatcherapi.com/v2/search?q=${keyword}&page_size=10`
  );
  getNews();
};

const render = () => {
  let newsHTML = "";
  newsHTML = news
    .map((item) => {
      return `<div class="row news">
    <div class="col-lg-4">
      <img class="news-img-size"
        src="${item.media}"
      />
    </div>

    <div class="col-lg-8">
      <h2>${item.title}</h2>
      <p>${item.summary}</p>
      <div>${item.rights} * ${item.published_date}</div>
    </div>
  </div>`;
    })
    .join("");

  document.getElementById("news-board").innerHTML = newsHTML;
};

const errorRender = (message) => {
  let errorHTML = `<div class="alert alert-danger text-center" role="alert">
  ${message}
</div>`;
  document.getElementById("news-board").innerHTML = errorHTML;
};

const pagenation = () => {
  // 1.1~5까지를 보여준다
  // 2.6~10을 보여준다 => last, first 가필요
  // 3.만약에 first가 6 이상이면 prev 버튼을 단다
  // 4.만약에 last가 마지막이 아니라면 next버튼을 단다
  // 5.마지막이 5개이하이면 last=totalpage이다
  // 6.페이지가 5개 이하라면 first = 1이다

  let pagenationHTML = ``;
  let pageGroup = Math.ceil(page / 5);
  let last = pageGroup * 5;
  let first = last - 4;

  pagenationHTML = ` <li class="page-item">
 <a class="page-link" href="#" aria-label="Previous" onclick="moveToPage(${
   page - 1
 })">
   <span aria-hidden="true">&lt;</span>
 </a>
</li>`;

  for (let i = first; i <= last; i++) {
    pagenationHTML += `<li class="page-item ${
      page == i ? "active" : ""
    }"><a class="page-link" href="#" onclick="moveToPage(${i})">${i}</a></li>`;
  }

  pagenationHTML += `<li class="page-item">
  <a class="page-link" href="#" aria-label="Next" onclick="moveToPage(${
    page + 1
  })">
    <span aria-hidden="true">&gt;</span>
  </a>
</li>`;

  document.querySelector(".pagination").innerHTML = pagenationHTML;
};

const moveToPage = (pageNum) => {
  //이동하고 싶은 페이지를 알아야 한다.
  page = pageNum;
  console.log(page);
  //이동하고 싶은 페이지를 가지고 api를 다시 호출한다.
  getNews();
};
searchButton.addEventListener("click", getNewsBykeyword);
getLatestNews();
