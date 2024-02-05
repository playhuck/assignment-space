---

## 클라썸 1차 과제

---

### 버전관리

| Framework/Library | Version |
| ----------------- | ------- |
| Nest.js           | 10.3.x  |
| TypeORM           | 0.3.17  |
| RDS (MySQL)       | 8.0.35  |
| Node.js           | 18.18.x |
| TypeScript        | 5.3.3   |

## Database

---

<details>
  <summary>데이터베이스 version_1</summary>

  <img src="https://github.com/playhuck/Algorithm-inflearn/assets/105256335/28fc2246-8039-4892-8147-36f4e7770aba">

</details>
- 데이터베이스 version_2
  https://github.com/playhuck/Algorithm-inflearn/assets/105256335/9106f387-de2b-4744-b15e-f2f78500cdd9
- 데이터베이스 version_3
  https://github.com/playhuck/Algorithm-inflearn/assets/105256335/3f515788-dfa9-4149-a3ce-cd2d01a4a6a3
- 데이터베이스 최종
  https://github.com/playhuck/Algorithm-inflearn/assets/105256335/cfc7cc6e-1548-4292-8fcb-a33e8ed7f09f

Database는 Local MySql로 연결하지 않고, RDS로 Mysql 8버전을 연결하여 사용 했습니다.

RDS를 사용하는 것이 더 익숙하고, 유연하다고 생각했습니다.

일반적으로 RDS를 사용하면, Private Subnet에 가둬 aws ssm이나 vpn을 통해

접근하여 사용할 수 있습니다.

하지만, 과제기 때문에 일단 public 액세스를 해제하여 알집파일로 같이 보내드린 환경변수로

앱을 실행한다면 RDS에 접근하여 앱이 실행될 것 입니다.

과제를 위해 생성한 Database이기 때문에, 차후 삭제할 예정입니다. 

대부분 관계를 지어 모델링 했으며, softRemove와 softDelete를 적극 사용하였습니다.

### **Installation**

---

```jsx
npm ci
```

### **Running the app**

---

1. Production
```jsx
npm run start 
```

- Production 단계를 의미합니다.
- **classum_prod** db를 사용합니다.

2. Development
```jsx
npm run dev 
```

- Development 단계를 의미합니다.
- classum_dev db를 사용합니다.
- Dev모드의 경우, API가 호출 될 때마다 아래와 같은 log가 기록됩니다.

3. test
```jsx
npm run test
```

- test mode를 의미합니다.
- classum_tset db를 사용합니다.

앱을 실행하기 위해선, 같이 알집파일에 압축된 각 환경변수와 secrets 폴더가 반드시 필요합니다.

환경변수와 secrets 폴더의 pem키가 사라져 있다면, App이 정상작동하지 않을 확률이 높습니다.

### 추가구현사항

---

1. 해당 과제를 통해, 일반적으로 도출할 수 있는 기능을 추가적으로 작성했습니다.

1. 그리고 추가 구현 사항 중, 게시글 상태 표시 기능을 추가적으로 작성했습니다.
