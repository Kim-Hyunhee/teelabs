# **티랩스**  
> **애터미 상품을 특정 공간에 등록하고 애터미 사이트와 연결하는 플랫폼을 개발하는 프로젝트**

---

## **목차**
1. [실행 환경](#1-실행-환경)  
   1-1. [로컬 실행](#1-1-로컬-실행)  
   1-2. [환경 변수](#1-2-환경-변수)  
2. [기술 스택](#2-기술-스택)  
3. [디렉토리 구조](#3-디렉토리-구조)  
4. [ERD](#4-erd)  
5. [기능 구현](#5-기능-구현)  
   5-1. [로그인](#5-1-로그인)  
   5-2. [상품 CRUD](#5-2-상품-CRUD)  
   5-3. [장바구니 CRUD](#5-4-장바구니-CRUD)  
   5-4. [대시보드 및 관리자 기능](#5-7-대시보드-및-관리자-기능)  

---

## **1. 실행 환경**
### **1-2. 환경 변수**  
- 아래 항목들이 `.env` 파일에 반드시 존재해야 합니다:
  - `DB_HOST`: 데이터베이스 연결 HOST 주소
  - `DB_TYPE`: 데이터베이스 연결 TYPE
  - `DB_USERNAME`: 데이터베이스 연결 username
  - `DB_PASSWORD`: 데이터베이스 연결 password
  - `DB_DATABASE`: 데이터베이스 연결 database 이름
  - `AWS_ACCESSKEY`: AWS Accesskey
  - `AWS_SECRETKEY`: AWS Secretkey
  - `JWT_SECRET_KEY`: JWT 토큰 서명에 사용될 비밀 키

---

### 기술 스택
<img src="https://img.shields.io/badge/TypeScript-version 4-3178C6">&nbsp;
<img src="https://img.shields.io/badge/Node.js-version 10-E0234E">&nbsp;
<img src="https://img.shields.io/badge/TypeORM-version 0.2-fcad03">&nbsp;
<img src="https://img.shields.io/badge/MySQL-version 8-00758F">&nbsp;

</br>

---

## 디렉토리 구조

<details>
<summary><strong>디렉토리 구조</strong></summary>
<div markdown="1">
 
```bash
└─src
    │  app.ts
    │  database.ts
    │  index.ts
    │
    ├─apis
    │      atomy.ts
    │
    ├─controller
    │      admin.ts
    │      cart.ts
    │      category.ts
    │      location.ts
    │      logs.ts
    │      product.ts
    │      statistics.ts
    │      upload.ts
    │      user.ts
    │
    ├─entity
    │      admin.ts
    │      cart.ts
    │      category.ts
    │      click_log_product.ts
    │      index.ts
    │      location.ts
    │      log_product.ts
    │      log_user.ts
    │      product.ts
    │      product_location.ts
    │      user.ts
    │
    ├─helper
    │      auth.ts
    │      s3Uploader.ts
    │      user.ts
    │
    ├─router
    │      admin.ts
    │      cart.ts
    │      category.ts
    │      index.ts
    │      location.ts
    │      logs.ts
    │      product.ts
    │      statistics.ts
    │      upload.ts
    │      upload_fbx.ts
    │      user.ts
    │
    ├─service
    │      cart.ts
    │      log.ts
    │      statistics.ts
    │      user.ts
    │
    └─swagger
            admin.yml
            cart.yml
            category.yml
            index.ts
            location.yml
            log.yml
            product.yml
            statistics.yml
            upload.yml
            user.yml
```
</div>
</details>

</br>

## **ERD**

<details>
<summary><strong>ERD 이미지 보기</strong></summary>
<div markdown="1">

![ERD 이미지](https://github.com/user-attachments/assets/9975decf-fffa-465e-8d6b-887ca734c8fc)

</div>
</details>

</br>

## 기능구현
### **5-1. 로그인** 
* 로그인 성공 시 토큰 발행(JWT 토큰 발행)
* 애터미 회원만 가능
  
### **5-2. 상품 CRUD** 
* 상품 목록, 수정

### **5-3. 장바구니 CRUD**
* 구매하고 싶은 상품 장바구니에 담기, 목록보기, 삭제

### **5-4. 대시보드 및 관리자 기능**
* 관리자 로그인 기능 (JWT 토큰 발급)
* 상품 CRUD
* 대시보드(방문자 수, 방문 기기, 링크 이동 횟수, 방문 통계 등)

 ---
 
 ## **Swagger 문서**
API 명세는 Swagger를 통해 확인할 수 있습니다. 아래 링크를 클릭하여 Swagger 문서로 이동하세요.

[Swagger 문서 보러 가기](https://github.com/user-attachments/assets/968eaf8a-a821-4f69-99ed-3b0edea52d8b)

---
