// 온도 불러오기
const API_URL = "https://apis.data.go.kr/6260000/BusanRvrwtQltyInfoService/getRvrwtQltyInfo";
const SERVICE_KEY = "1TcBEfaeVj0nKdA3JfBPismv39rsS%2B%2BrMXUGubaIMo8IRQFDXW5zTaKkquZMas2nnPEfNV6ASYvND%2BvXYymW%2BQ%3D%3D";

async function fetchTemperature() {
  try {
  const response = await fetch(`${API_URL}?serviceKey=${SERVICE_KEY}&numOfRows=10&pageNo=1`);
  const text = await response.text();
  const parser = new DOMParser();
  const xml = parser.parseFromString(text, "application/xml");
  const items = xml.getElementsByTagName("item");

  let tempText = "데이터 없음";

  for (let item of items) {
    const riverName = item.getElementsByTagName("area_NAME")[0]?.textContent;
    if (riverName === "낙동강") {
      const temp = item.getElementsByTagName("water10")[0]?.textContent;
      if (temp) {
        tempText = `${temp}°C`;
        if (temp <= 17.0) {
          document.getElementById("temp").style.color = '#4876FF'
          document.getElementById("status").style.background = '#4876FF'
        }
        if (temp <= 23.0 && temp >= 18.0) {
          document.getElementById("temp").style.color = '#35C73E'
          document.getElementById("status").style.background = '#35C73E'
        }
        if (temp >= 24) {
          document.getElementById("temp").style.color = '#F64E4E'
          document.getElementById("status").style.background = '#F64E4E'
        }
        break;
      }
    }
  }

  document.getElementById("temp").textContent = tempText;
  } catch (error) {
  console.error("에러 발생:", error);
  document.getElementById("temp").textContent = "Failed";
  }
}

// 시간 업데이트
function updateTimeLabel() {
  const now = new Date();

  const month = now.getMonth() + 1;
  const date = now.getDate();
  const hours = now.getHours().toString().padStart(2, '0');

  const formatted = `${month}월 ${date}일 ${hours}:00 기준`;
  document.getElementById("time-info").textContent = formatted;
}

fetchTemperature();
updateTimeLabel();
setInterval(updateTimeLabel, 60 * 60 * 1000);