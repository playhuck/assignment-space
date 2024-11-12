---

## 과제 (공개허락받음)

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
  <summary>데이터베이스 v1</summary>

  <img src="https://github.com/playhuck/Algorithm-inflearn/assets/105256335/28fc2246-8039-4892-8147-36f4e7770aba">

</details>
<details>
  <summary>데이터베이스 v2</summary>

  <img src="https://github.com/playhuck/Algorithm-inflearn/assets/105256335/9106f387-de2b-4744-b15e-f2f78500cdd9">

</details>
<details>
  <summary>데이터베이스 v3</summary>

  <img src="https://github.com/playhuck/Algorithm-inflearn/assets/105256335/3f515788-dfa9-4149-a3ce-cd2d01a4a6a3">

</details>
<details>
  <summary>데이터베이스 v4</summary>

  <img src="https://github.com/playhuck/Algorithm-inflearn/assets/105256335/cfc7cc6e-1548-4292-8fcb-a33e8ed7f09f">

</details>

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
