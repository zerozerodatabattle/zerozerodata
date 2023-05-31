const apiUrl = 'https://openapi.seoul.go.kr:8088/6d4b544c4170617237377841787353/xml/culturalEventInfo/1/999';

const eventsDiv = document.getElementById('events');
const checkboxes = document.querySelectorAll('input[type="checkbox"]');
let itemsPerPage = 10; // 페이지당 표시되는 항목 수
let currentPage = 1; // 현재 페이지 번호
let items = []; // 모든 항목을 저장할 배열
let xmlDoc;

fetch(apiUrl)
  .then(response => response.text())
  .then(data => {
    const parser = new DOMParser();
    xmlDoc = parser.parseFromString(data, 'text/xml');

    items = xmlDoc.getElementsByTagName('row'); // XML 데이터에서 'row' 태그의 모든 요소를 가져와서 items 배열에 저장
    displayPageItems(items); // 페이지에 항목을 표시
    displayPageNumber(); // 페이지 번호 표시
  })
  .catch(error => {
    console.error('Error:', error);
  });

function displayPageItems(items) {
  eventsDiv.innerHTML = ''; // 이전에 표시된 이벤트를 제거

  const startIndex = (currentPage - 1) * itemsPerPage; // 시작 인덱스 계산
  const endIndex = startIndex + itemsPerPage; // 끝 인덱스 계산

  // 페이지에 표시할 항목들을 반복하여 생성
  for (let i = startIndex; i < endIndex && i < items.length; i++) {
    const item = items[i];
    const title = item.getElementsByTagName('TITLE')[0].childNodes[0].nodeValue; // 제목 정보 추출
    const guname = item.getElementsByTagName('GUNAME')[0].childNodes[0]?.nodeValue ?? '지역정보가 없습니다.'; // 지역 정보 추출
    const imgUrl = item.getElementsByTagName('MAIN_IMG')[0].childNodes[0].nodeValue; // 이미지 URL 추출
    const time = item.getElementsByTagName('DATE')[0].childNodes[0].nodeValue; // 시간 정보 추출
    const orgLink = item.getElementsByTagName('ORG_LINK')[0].childNodes[0].nodeValue; // 원본 링크 추출

    const eventDiv = document.createElement('div');
    eventDiv.classList.add('event'); // 이벤트를 담을 div 요소 생성

    const imgContainer = document.createElement('div');
    imgContainer.classList.add('img-container'); // 이미지를 담을 div 요소 생성
    eventDiv.appendChild(imgContainer);

    const img = document.createElement('img');
    img.src = imgUrl;
    img.alt = title; // 이미지 요소 생성 및 속성 설정
    imgContainer.appendChild(img);

    const textContainer = document.createElement('div');
    textContainer.classList.add('text-container'); // 텍스트를 담을 div 요소 생성
    eventDiv.appendChild(textContainer);

    const linkContainer = document.createElement('a'); // 링크 컨테이너
    linkContainer.href = orgLink; // 링크 설정
    linkContainer.target = '_blank'; // 새 창에서 열기
    textContainer.appendChild(linkContainer); // 링크 컨테이너를 텍스트 컨테이너의 자식으로 추가

    const titleText = document.createElement('span');
    titleText.textContent = title;
    linkContainer.appendChild(titleText); // 제목을 담은 span 요소를 링크 컨테이너의 자식으로 추가

    const ul = document.createElement('ul');

    const timeLi = document.createElement('li');
    timeLi.textContent = `시간: ${time}`;
    ul.appendChild(timeLi); // 시간 정보를 담은 li 요소를 ul의 자식으로 추가

    const gunameLi = document.createElement('li');
    gunameLi.textContent = `지역: ${guname}`;
    ul.appendChild(gunameLi); // 지역 정보를 담은 li 요소를 ul의 자식으로 추가

    linkContainer.appendChild(ul); // ul 요소를 링크 컨테이너의 자식으로 추가

    eventsDiv.appendChild(eventDiv); // 이벤트 div 요소를 eventsDiv에 추가

    eventDiv.addEventListener('click', () => {
      window.open(orgLink, '_blank'); // 컨테이너 클릭 시 링크로 이동
    });
  }
}

function displayPageNumber() {
  const totalPages = Math.ceil(items.length / itemsPerPage); // 전체 페이지 수 계산
  const pageNumbersContainer = document.getElementById('page-number');
  pageNumbersContainer.innerHTML = ''; // 이전 페이지 번호 제거

  let startPage = 1; // 시작 페이지 번호
  let endPage = Math.min(startPage + 9, totalPages); // 종료 페이지 번호

  // 현재 페이지가 10 이상인 경우 시작 페이지와 종료 페이지 재조정
  if (currentPage > 10) {
    const currentBlock = Math.ceil(currentPage / 10);
    startPage = (currentBlock - 1) * 10 + 1;
    endPage = Math.min(startPage + 9, totalPages);
  }

  // 페이지 번호를 생성하여 페이지 번호 컨테이너에 추가
  for (let i = startPage; i <= endPage; i++) {
    const pageNumber = document.createElement('button');
    pageNumber.textContent = i; // 버튼 텍스트에 페이지 번호 할당
    pageNumber.classList.add('page-number'); // 페이지 번호에 CSS 클래스 'page-number' 추가
    if (i === currentPage) {
      pageNumber.classList.add('current-page'); // 현재 페이지 번호에 CSS 클래스 'current-page' 추가
    }
    pageNumber.addEventListener('click', () => {
      currentPage = i; // 클릭한 페이지 번호를 현재 페이지로 설정
      displayPageItems(items); // 해당 페이지의 아이템 표시
      displayPageNumber(); // 페이지 번호 갱신
    });
    pageNumbersContainer.appendChild(pageNumber); // 페이지 번호 버튼을 페이지 번호 컨테이너에 추가
  }
}

function goToPrevPage() {
  if (currentPage > 1) {
    currentPage--; // 이전 페이지로 이동
    displayPageItems(items); // 해당 페이지의 아이템 표시
    displayPageNumber(); // 페이지 번호 갱신
  }
}

function goToNextPage() {
  const totalPages = Math.ceil(items.length / itemsPerPage);
  if (currentPage < totalPages) {
    currentPage++; // 다음 페이지로 이동
    displayPageItems(items); // 해당 페이지의 아이템 표시
    displayPageNumber(); // 페이지 번호 갱신
  }
}

const prevButton = document.getElementById('prev-page');
const nextButton = document.getElementById('next-page');
const pageNumber = document.getElementById('page-number');
const dataPerPageSelect = document.getElementById('dataPerPage');

prevButton.addEventListener('click', goToPrevPage); // 이전 페이지 버튼에 클릭 이벤트 리스너 추가
nextButton.addEventListener('click', goToNextPage); // 다음 페이지 버튼에 클릭 이벤트 리스너 추가

dataPerPageSelect.addEventListener('change', () => {
  itemsPerPage = parseInt(dataPerPageSelect.value); // 선택한 데이터 개수를 itemsPerPage에 할당
  currentPage = 1; // 페이지를 첫 번째 페이지로 초기화
  displayPageItems(items); // 해당 페이지의 아이템 표시
  displayPageNumber(); // 페이지 번호 갱신
});

checkboxes.forEach(checkbox => {
  checkbox.addEventListener('change', () => {
    const checkedGunames = Array.from(checkboxes)
      .filter(checkbox => checkbox.checked)
      .map(checkbox => checkbox.id); // 선택된 지역의 ID를 배열로 추출
    const filteredItems = Array.from(xmlDoc.getElementsByTagName('row'))
      .filter(item => {
        const guname = item.getElementsByTagName('GUNAME')[0].childNodes[0]?.nodeValue ?? '지역정보없음'; // 아이템의 지역명 추출
        return checkedGunames.length === 0 || checkedGunames.includes(guname); // 선택된 지역이 아닌 경우 필터링
      });
    currentPage = 1; // 페이지를 첫 번째 페이지로 초기화
    displayPageItems(filteredItems); // 필터링된 아이템을 표시
    displayPageNumber(); // 페이지 번호 갱신
  });
});

const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');

// 검색 버튼 클릭 시 이벤트 핸들러
searchButton.addEventListener('click', performSearch);

// 엔터 키 입력 시 검색 수행
searchInput.addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
    performSearch();
  }
});

// 검색 수행 함수
function performSearch() {
  const searchKeyword = searchInput.value.trim(); // 입력된 검색어 가져오기
  if (searchKeyword.trim() === "") {
    refreshPage();
  }
  else {
    // 검색어가 비어있지 않은 경우에만 검색 수행
    const filteredItems = Array.from(xmlDoc.getElementsByTagName('row')).filter(item => {
      const title = item.getElementsByTagName('TITLE')[0].childNodes[0].nodeValue; // 아이템의 제목 추출
      return title.includes(searchKeyword); // 검색어를 포함하는 제목인 경우 필터링
    });
    currentPage = 1; // 페이지를 첫 번째 페이지로 초기화
    displayPageItems(filteredItems); // 필터링된 아이템을 표시
    displayPageNumber(); // 페이지 번호 갱신
  }
  // 검색 후 검색어 입력 필드 비우기
  searchInput.value = '';
}

function refreshPage() {
  location.reload();
}
