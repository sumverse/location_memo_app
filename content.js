//jquery는 js를 더 간단하게 사용할 수 있게 돕는 라이브러리

let diaryItems = [];

//1. 크롬스토리지에서 데이터 불러오는 함수 선언
function getDiaryItems() {
  //1.크롬스토리지에서 데이터 가져오기
  chrome.storage.local.get("diary", (result) => {
    if (result.diary) {
      console.log("성공", result.diary);
      diaryItems = result.diary;
      //forEach()->함수 / 배열의 갯수만큼 반복 실행
      diaryItems.forEach((item) => {
        //item => diary{}(다이어리객체)
        //1. li태그 만들기
        const $li = $("<li>");
        //1. 속성의 이름
        //2. 속성의 값
        $li.attr("id", item.id);
        //2. p태그 만들기
        const $p = $("<p>");
        $p.text(`${item.date} ${item.text}`);

        //3. 삭제버튼 만들기
        const $removeBtn = $("<button>")
          .text("삭제")
          .on("click", function () {
            //삭제 이벤트 등록
            //삭제 버튼의 부모(li) 삭제
            $(this).parent().remove();
            //1.li요소의 id속성 가져오기 (제이쿼리 사용)
            const id = $(this).parent().attr("id");
            //가져온 id를 제외한 새로운 배열 생성
            let newDiaryItems = diaryItems.filter((item) => {
              return item.id != id;
            });
            chrome.storage.local.set({ diary: newDiaryItems }, () => {
              console.log("데이터 저장 성공");
            });
          });

        //4. li요소에 p, button 추가하기 (들어가있는 순서대로!)
        $li.append($p);
        $li.append($removeBtn);
        //5.list에 li요소 추가하기
        $(".diary-list").append($li);
      });
    } else {
      console.log("데이터 없음");
    }
  });
}

//jquery 불러오는 기본 코드 : $(function (){})
$(function () {
  //dialog 모달창 띄우기
  //add-btn 태그 가져오기
  //on:이벤트 바로 열기 / click했을 때, 함수를 실행하겠다.
  getDiaryItems();
  $(".add-btn").on("click", () => {
    let modal = $("#modal");
    // console.log(modal);
    //modal의 객체=dialog를 부르는 방법

    //showModal() 메서드 : dialog태그 모달창으로 화면에 표시
    //세트! showModal() -> close()
    modal[0].showModal();
  });
  //overlay(뒤에 흐릿한 배경)클릭 시 모달창 닫기
  //e 매개변수 : event 객체 = 이벤트가 발생했을 때 자동으로 전달되는 정보가 담긴 객체
  $("#modal").on("click", function (e) {
    let modal = $("#modal");
    // console.log(modal);
    //dlqpsxmrk qkftodgks dythrk #madal일 경우에만 모달창 종료
    if (e.target === this) {
      modal[0].close();
    }
  });

  //폼 제출 이벤트로 데이터 가져오기
  //modal 안의 form태그
  //submit 제출하는 이벤트를 가져오기
  $("#modal form").on("submit", () => {
    //1.textarea에 적은 값 가져오기 (오늘의 한 줄 일기를 기록하세요...)
    //modal안의 textarea 불러오기
    //val=value (폼요소의 값)
    const diaryText = $("#modal textarea").val();
    //2.현재 날짜를 가져오기
    //dayjs를 사용
    const formatDate = dayjs().format("YYYY-MM-DD");
    // console.log(diaryText, formatDate);

    //1.Diary데이터 객체화
    const diary = {
      date: formatDate,
      text: diaryText,
      id: Date.now() + "",
    };

    //배열에 새로 생성된 diary 객체 넣기 (여러개의 데이터를 하나로 묶어서 관리하기 위해)
    //배열에는 순서가 있음
    diaryItems.push(diary);

    chrome.storage.local.set({ diary: diaryItems }, () => {
      console.log("데이터 저장 성공");
    });

    //1. li태그 만들기
    const $li = $("<li>");
    //1. 속성의 이름
    //2. 속성의 값
    $li.attr("id", diary.id);
    //2. p태그 만들기
    const $p = $("<p>");
    $p.text(`${diary.date} ${diary.text}`);

    //3. 삭제버튼 만들기
    const $removeBtn = $("<button>")
      .text("삭제")
      .on("click", function () {
        //삭제 이벤트 등록
        //삭제 버튼의 부모(li) 삭제
        $(this).parent().remove();
        //1.li요소의 id속성 가져오기 (제이쿼리 사용)
        const id = $(this).parent().attr("id");
        //가져온 id를 제외한 새로운 배열 생성
        let newDiaryItems = diaryItems.filter((item) => {
          return item.id != id;
        });
        diaryItems = newDiaryItems;
        chrome.storage.local.set({ diary: newDiaryItems }, () => {
          console.log("데이터 저장 성공");
        });
      });

    //4. li요소에 p, button 추가하기 (들어가있는 순서대로!)
    $li.append($p);
    $li.append($removeBtn);
    //5.list에 li요소 추가하기
    $(".diary-list").append($li);
    //text내용 비우기 (val은 값을 가져오기도, 지우기도 한다.)
    $("#modal textarea").val("");
  });
});

const options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0,
};

function success(pos) {
  var crd = pos.coords;
  let latitude = crd.latitude;
  let longitude = crd.longitude;
  let apikey = "f4e8ead9097b0c86b6b38e14d83dd550";
  //fetch함수 : 날씨 데이터 불러오기
  //promise(비동기방식) 반환

  fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apikey}&units=metric&lang=kr`
  )
    .then((Response) => {
      //console.log(Response);
      //json을 js로 변환하기
      return Response.json();
    })
    .then((data) => {
      console.log(data);
      const weather = data.weather[0].description;
      const icon = data.weather[0].icon;
      const imageurl = `https://openweathermap.org/img/wn/${icon}@2x.png`;
      console.log(weather);
      //Math.round() -> 소수점을 버리는 함수
      const temp = Math.round(data.main.temp);
      console.log(temp);
      //html 클래스 부르기 $(".")
      $(".weather").text(`${weather}${temp}℃`);
      $(".weather-icon").attr("src", imageurl);
    });

  console.log("Your current position is:");
  console.log(`Latitude : ${crd.latitude}`);
  console.log(`Longitude: ${crd.longitude}`);
  console.log(`More or less ${crd.accuracy} meters.`);
}

function error(err) {
  console.warn(`ERROR(${err.code}): ${err.message}`);
}

navigator.geolocation.getCurrentPosition(success, error);
