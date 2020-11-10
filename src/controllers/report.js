import { reportService , majorDataService, scoreService, highestScoreService } from '../services'
import Joi from '@hapi/joi'

import { createErrorResponse } from '../utils/functions'

export default class reportController {

  static async create ( req, res ) {

    try {
      const { user } = req
      const result = await Joi.validate ( req.body, {
        majorDataId : Joi.number().required()
      })

      const { majorDataId  } = result   

      const already_report = await reportService.findOne({ majorDataId, userId : user.id})

      if ( already_report != null) throw Error ('REPORT_ALREADY_EXISTS')

      const majorData = await majorDataService.findOne({id : majorDataId})

      if ( majorData == null ) throw Error('MAJOR_DATA_NOT_FOUND')

      const score = await scoreService.findOne({userId : user.id})

      if ( score == null ) throw Error('SCORE_NOT_FOUND')

      if ( majorData.ratio.math.ga == 0 && score.math.type == "가") throw Error('MATH_NA_NOT_FOUND')
      else if ( majorData.ratio.math.na == 0 && score.math.type =="나") throw Error('MATH_GA_NOT_FOUND')
      else if ( majorData.ratio.tamgu.science == 0 && score.line == "자연") throw Error('SCIENCE_NOT_FOUND')
      else if ( majorData.ratio.tamgu.society == 0 && score.line == "인문") throw Error('SOCIET_NOT_FOUND')


      const modelObj = await reportController.getScore(score , majorData , true)

      const report = await reportService.create(modelObj)

      console.log("FUCK")

      const response = {
        success : true ,
        data : {
          report
        }
      }

      res.send(response)
      

    } catch ( e ) {
      res.send(createErrorResponse(e))
    }
  }
  

  static async findOne ( req, res ) {

    try {

      const id = req.params.id 

      const report = await reportService.findOne({id})

      if ( report == null ) throw Error('REPORT_NOT_FOUND')

      const majorDataId = report.majorDataId

      const reports = await reportService.findAll(majorDataId)

      console.log(reports)
      
      reports.sort(function(a, b){
        return b.totalScore - a.totalScore
      })

      const applicantsNumber = Object.keys(reports).length
      const myRank = reports.findIndex( function ( item , index) {

        return item.id == id
      }) + 1

      const response = {
        success : true,
        data : {
          report,
          applicantsNumber,
          myRank
        }
      }
      res.send(response)

    } catch ( e ) {
      res.send(createErrorResponse(e))
    }

  }

  static async findList ( req, res ) {

    try {

      const { user } = req 

      console.log(user)
      const reports = await reportService.findList(user.id)


      const response = {
        success : true,
        data : {
          reports
        }
      }
      res.send(response)

    } catch ( e ) {

      res.send(createErrorResponse(e))
    }

  }

  static async update ( req, res) {

    try {
      
      const response = {
        success : true 
      }

      res.send(response)
      

    } catch ( e ) {
      res.send(createErrorResponse(e))
    }
  }

  static async delete ( req, res ) {

    try {
      const id = req.params.id

      await reportService.delete(id)

      const response = {
          success : true 
      }

      res.send(response)


  } catch ( e) {
      res.send(createErrorResponse(e))
  }


  }

  static async compare ( a , b ) {   return b - a;   } 

  static async getScore ( score, majorData , create ) {

    /**
     * 점수 구하는 방법
     * 1. 들어온 성적, 이용될 만점 구하기
     * 2. 활용 지표와 반영 비율 가지고 각 과목의 변환 점수 구하기 
     * 3. 변환 점수에서 가산점 구하기
     * 4. 반영 과목으로 넣을과목은 넣고 뺄 과목은 빼기 
     * 5. 싸그리 더해서 점수 구하기
     */
    const tamguPercentileToScore = [66.22,	66,	65.56,	65.26,	64.92,	64.58,	64.24,	63.95,	63.64,	63.32,	63,	62.75,	62.49,	62.25,	62.01,	61.75,	61.49,	61.22,	60.96,	60.7,	60.44,	60.2,	59.96,	59.7,	59.46,	59.12,	58.86,	58.56,	58.21,	57.89,	57.56,	57.25,	56.95,	56.65,	56.36,	56.05,	55.72,	55.37,	54.99,	54.59,	54.2,	53.83,	53.46,	53.06,	52.57,	52.2,	51.82,	51.43,	50.97,	50.56,	50.16,	49.76,	49.37,	48.94,	48.51,	48.12,	47.62,	47.18,	46.77,	46.41,	46.08,	45.76,	45.41,	45.05,	44.74,	44.38,	44.02,	43.69,	43.37,	43.07,	42.74,	42.4,	42.1,	41.79,	41.5,	41.13	,40.73,	40.45,	40.18,	39.93,	39.68,	39.42,	39.14,	38.86,	38.53,	38.19,	37.9,	37.58,	37.28,	36.9,	36.58,	36.26,	35.83,	35.42,	34.96,	34.51,	34.05,	33.55,	32.92,	32.11,	30.33]



     /**
      * 1. 들어온 성적, 이용될 만점 구하기 
      */
    var major_perfectScore = majorData.metadata.perfectScore
    const basicScore = majorData.metadata.basicScore
    const specialOption = majorData.metadata.specialOption
    const tamguTranslation = majorData.metadata.tamguTranslation

    if ( isNaN(basicScore) == false ) major_perfectScore = major_perfectScore - basicScore

    const major_ratio = majorData.ratio

    let perfectScore = {
      korean : major_perfectScore * ( major_ratio.korean / 100 ),
      english : major_perfectScore * (major_ratio.english / 100),
      math : 0,
      tamgu : 0,
      history : major_perfectScore * (major_ratio.history / 100)
    }

    

    console.log(majorData.major.univName)
    console.log(majorData.major.majorName)

    const math_type = score.math.type
    const tamgu_type = score.line
    const english_type = major_ratio.english 
    const history_type = major_ratio.history 

    console.log(math_type)
    console.log(tamgu_type)

    console.log("english_type ")
    console.log(english_type)

    console.log("history_type")
    console.log(history_type)

    if ( math_type == "가") {
      perfectScore.math = major_perfectScore * ( major_ratio.math.ga / 100 )
    } else if ( math_type == "나") {
      perfectScore.math = major_perfectScore * (major_ratio.math.na / 100 )
    }

    if ( tamgu_type == "인문"){
      perfectScore.tamgu = major_perfectScore * ( major_ratio.tamgu.society / 100)
    } else {
      perfectScore.tamgu = major_perfectScore * ( major_ratio.tamgu.science / 100)
    }

    if ( english_type =="가산" || english_type =="필수") {
      perfectScore.english = 0
    }

    if ( history_type == "가산" || history_type =="필수") {
      perfectScore.history = 0 
    }

    if ( specialOption.indexOf("영역별 점수 : 국(200) / 수(200) / 탐(200) ") >= 0) {

      perfectScore.korean = 200
      perfectScore.math = 200
      perfectScore.tamgu = 200
      perfectScore.english = 135
    }

    /**
     * 2. 활용 지표와 반영 비율 가지고 각 과목의 변환 점수 구하기 
     */
    const applicationIndicatorType = majorData.metadata.applicationIndicatorType

    let newScore = {

      korean : 0,

      english : 0,

      tamgu1 : {
        score : 0,
        name : score.tamgu1.name
      }, 

      tamgu2 : {
        score : 0,
        name : score.tamgu2.name
      }, 

      math : 0 , 
      history : 0 , 
      foreign : {
        score : 0,
        name :score.foreign.name
      } , 
      
      total : 0 
    } 

    /**
     * 본 점수를 구하기 전에 가산점을 먼저 보고 들어가야하는 대학이 몇군데 있는 것 같다.
     */

    if ( majorData.metadata.extraPoint == "수가 선택시 1등급 상향") {

      if ( score.math.type == "가" && score.math.grade != 1 ) {
        score.math.grade = score.math.grade - 1 
      }
    }

    console.log("만점 구하기 성공!")

    console.log(applicationIndicatorType)

    /**
     * 점수를 구해보자 
     */
  

    //백분위 x (총점에 따른 비율)  [ 국, 수, 탐 ] + 영 + 한
    if ( majorData.major.univName == "가야대") {
      newScore = await reportController.gayaScore(score,majorData)

    }
    else if ( applicationIndicatorType == "A") {
      newScore.korean = (score.korean.percentile * perfectScore.korean ) / 100 
      newScore.math = ( score.math.percentile * perfectScore.math ) / 100 
      newScore.tamgu1.score = ( score.tamgu1.percentile * perfectScore.tamgu) / 100
      newScore.tamgu2.score = ( score.tamgu2.percentile * perfectScore.tamgu) / 100  
      newScore.foreign.score = (score.foreign.percentile * perfectScore.tamgu) / 100 
    }
    // 표준점수 x (총점에 따른 비율) [ 국, 수, 탐 ] + 영 + 한
    else if ( applicationIndicatorType == "B") {
      newScore.korean = score.korean.score * ( perfectScore.korean  ) / 100
      newScore.math = score.math.score * ( perfectScore.math  ) / 100

      newScore.tamgu1.score = tamguPercentileToScore[100-score.tamgu1.percentile]  * ( perfectScore.tamgu) / 100
      newScore.tamgu2.score = tamguPercentileToScore[100-score.tamgu2.percentile] * ( perfectScore.tamgu) / 100
      newScore.foreign.score = tamguPercentileToScore[100-score.foreign.percentile] * ( perfectScore.tamgu ) / 100
    }
    // ( 표준점수 / 200 ) x (총점에 따른 비율) [ 국, 수, 탐 ] + 영 + 한
    else if ( applicationIndicatorType == "C") {
      newScore.korean = score.korean.score * ( perfectScore.korean ) / 200
      newScore.math = score.math.score * ( perfectScore.math  ) / 200

      if ( tamguTranslation.indexOf("탐구 변표사용") >= 0) { 

        newScore.tamgu1.score = tamguPercentileToScore[100-score.tamgu1.percentile] * perfectScore.tamgu / 100
        newScore.tamgu2.score = tamguPercentileToScore[100-score.tamgu2.percentile] * perfectScore.tamgu / 100 
        newScore.foreign.score = tamguPercentileToScore[100-score.foreign.percentile] * perfectScore.tamgu / 100 
      }
      else {

        newScore.tamgu1.score = score.tamgu1.score * (perfectScore.tamgu) / 100
        newScore.tamgu2.score = score.tamgu2.score * (perfectScore.tamgu) / 100
        newScore.foreign.score = score.foreign.score * ( perfectScore.tamgu) / 100 
      }

      if ( specialOption == "탐구 본교 백분위변환표준점수+100 한 후 계산") {

        newScore.tamgu1.score += 100
        newScore.tamgu2.score += 100
        newScore.foreign.score += 100 
      }

    }

    // ( 표준점수 / 과목 별 표준점수 최고점 ) x (총점에 따른 비율) [ 국, 수, 탐 ] + 영 + 한
    else if ( applicationIndicatorType == "D") {

      const highestKorean = await highestScoreService.findOne("국어","국어")
      const highestMath = await highestScoreService.findOne("수학",math_type)

      console.log("백분위 = " + score.tamgu1.percentile)

      var tempTamgu1 = score.tamgu1.score
      var tempTamgu2 = score.tamgu2.score
      var tempForeign = score.foreign.score

      if ( tamguTranslation.indexOf("탐구 변표사용") >= 0 ) {

          
        tempTamgu1 = tamguPercentileToScore[100-score.tamgu1.percentile]
        tempTamgu2 = tamguPercentileToScore[100-score.tamgu2.percentile]
        tempForeign = tamguPercentileToScore[100-score.foreign.percentile]
      }


      var highest_tamgu_type = ""
      if ( tamgu_type == "자연") highest_tamgu_type = "과학탐구"
      else highest_tamgu_type = "사회탐구"

    

      const highestTamgu1 = await highestScoreService.findOne(highest_tamgu_type, score.tamgu1.name)
      const highestTamgu2 = await highestScoreService.findOne(highest_tamgu_type, score.tamgu2.name)
      const highestForeign = await highestScoreService.findOne("제2외국어", score.foreign.name )

      newScore.korean = score.korean.score * ( perfectScore.korean ) / highestKorean.score
      newScore.math = score.math.score * (perfectScore.math ) / highestMath.score
      newScore.tamgu1.score = tempTamgu1 * ( perfectScore.tamgu ) / highestTamgu1.score
      newScore.tamgu2.score = tempTamgu2 * ( perfectScore.tamgu ) / highestTamgu2.score
      if ( highestForeign != null) newScore.foreign.score = tempForeign * ( perfectScore.tamgu ) / highestForeign.score

    }

    // ( 표준점수 / 160 ) x (총점에 따른 비율) [ 국, 수, 탐 ] + 영 + 한
    else if ( applicationIndicatorType == "E") {

      newScore.korean = score.korean.score * ( perfectScore.korean ) / 160
      newScore.math = score.math.score * ( perfectScore.math  ) / 160
      newScore.tamgu1.score = tamguPercentileToScore[100-score.tamgu1.percentile] / 160
      newScore.tamgu2.score = tamguPercentileToScore[100-score.tamgu2.percentile] / 160
      newScore.foreign.score = tamguPercentileToScore[100-score.foreign.percentile] / 160

    }
    
    // 표준점수의 합
    else if ( applicationIndicatorType == "F") {

      newScore.korean = score.korean.score
      newScore.math = score.math.score
      newScore.tamgu1.score = score.tamgu1.score
      newScore.tamgu2.score = score.tamgu2.score
      newScore.foreign.score = score.foreign.score   

      console.log(newScore.tamgu1)
      console.log(newScore.tamgu2)
    }
    
    // 등급: 4과목 평균 등급 환산점수
    else if ( applicationIndicatorType == "G") {

      console.log(majorData.major.univName)

      if ( majorData.major.univName.indexOf("경동대") >= 0) {
        console.log("경동대로 가즈아!")
        const gyungDongScore = await reportController.getScoreByGrade(score, majorData)

        console.log("GyungDong Score" + gyungDongScore)

        return gyungDongScore
      }
      else { 
        newScore = await reportController.getScoreByGrade(score,majorData)
      }
    }

    // 등급: [ 국,수,탐,영 평균 등급 활용 : ( 각 과목 별 평균등급에  해당하는 점수 x 비율 ) 의 합 ]
    else if ( applicationIndicatorType == "H") {
      newScore = await reportController.getScoreByGrade(score,majorData)
    }

    // 등급: 과목 별 등급에 따른 환산점수의 합
    else if ( applicationIndicatorType == "I") {
      newScore = await reportController.getScoreByGrade(score,majorData)
    }

    // 가산점을 구해보자!

    const extraType = majorData.metadata.extraType
    const extraSubject = majorData.metadata.extraSubject
    const extraValue = majorData.metadata.extraValue
    const extraPoint = majorData.metadata.extraPoint

    let extraScore = {
      korean : 0,
      english : 0,
      math : 0,
      tamgu1 : 0,
      tamgu2 : 0, 
      history : 0,
      foreign : 0
    }

    const emv = majorData.metadata.emv
    const hmv = majorData.metadata.hmv

    if ( emv == "반영x") {

    } else {

      if ( emv == "x비율"){


      }
      else if ( emv == "평균등급활용"){


      }
      else if ( emv == "예외/옵션참고") {


      }

      else if ( majorData.gradeToScore.english.way == "수능비율포함") {
        newScore.english = majorData.gradeToScore.english.score[score.english.grade-1] * emv
      }

      else {
      
        extraScore.english = majorData.gradeToScore.english.score[score.english.grade-1] * emv

      }
    }

    

    if ( hmv == "반영x") {


    } else {

      if ( hmv == "x비율"){


      }
      else if ( hmv == "평균등급활용") {


      }
      else if ( hmv == "예외/옵션창고") {


      }

      else if ( majorData.gradeToScore.history.way =="수능비율포함") {
        newScore.history = majorData.gradeToScore.history.score[score.history.grade-1] * hmv 
      }

      else {

        extraScore.history = majorData.gradeToScore.history.score[score.history.grade-1] * hmv
      }
    }

    console.log("변환 점수 구하기 성공!")

  


    if ( english_type == "가산"|| english_type == "감산" || metadata.gradeToScore.english.way == "감점") {
      extraScore.english = majorData.gradeToScore.english.score[score.english.grade-1] * emv
    }

    if ( history_type == "가산" || history_type =="감산" || metadata.gradeToScore.history.way =="감점") {
      extraScore.history = majorData.gradeToScore.history.score[score.history.grade-1] * hmv 
    }

    var extra1 = 0
    var extra2 = 0

    console.log(extraValue)

    if ( ( extraValue.length > 0 ) && extraValue.indexOf(" // ") >= 0 ) {
      extra1 = parseInt(extraValue.split(" // ")[0])
      extra2 = parseInt(extraValue.split(" // ")[1])
    }

    console.log("extra값이 시발 제대로 안구해져")
    console.log(extra1)
    console.log(extra2)

    

    if ( extraType == "% 가산") {

      if ( extraSubject == "수가") {
        if ( score.math.type =="가") {
          extraScore.math = ( newScore.math * extraValue ) / 100 
        }
        
      }

      else if ( extraSubject == "과탐") {
        if (score.line =="자연") {
          extraScore.tamgu1 = ( newScore.tamgu1.score * extraValue) / 100 
          extraScore.tamgu2 = ( newScore.tamgu2.score * extraValue) / 100

        }
      }

      else if ( extraSubject == "과탐Ⅱ") {

        if ( score.tamgu1.name.indexOf("2") >= 0) extraScore.tamgu1 = ( newScore.tamgu1.score * extraValue) / 100
        if ( score.tamgu2.name.indexOf("2") >= 0) extraScore.tamgu2 = ( newScore.tamgu2.score * extraValue) / 100 
      }

      else if ( extraSubject == "물리") {

        if ( score.tamgu1.name.indexOf("물리") >= 0) extraScore.tamgu1 = (newScore.tamgu1.score * extraValue) / 100
        if ( score.tamgu2.name.indexOf("물리") >= 0) extraScore.tamgu2 = (newScore.tamgu2.score * extraValue) / 100 

      }
      else if ( extraSubject == "사탐" ){

        if ( score.line == "인문") {
          extraScore.tamgu1 = ( newScore.tamgu1.score * extraValue) / 100 
          extraScore.tamgu2 = ( newScore.tamgu2.score * extraValue) / 100
        }

      }

      else if ( extraSubject == "독일어") {

        if ( score.foreign.name == "독일어") {
          extraScore.foreign = ( newScore.foreign * extraValue) / 100 
        }
      }

      else if ( extraSubject == "중국어") {

        if ( score.foreign.name == "중국어") {
          extraScore.foreign = ( newScore.foreign * extraValue) / 100 
        }

      }

      else if ( extraSubject == "일본어") {


        if ( score.foreign.name == "일본어") {
          extraScore.foreign = ( newScore.foreign * extraValue) / 100 
        }

      }
      else if ( extraSubject == "러시아어") {
        
        if ( score.foreign.name == "러시아어") {
          extraScore.foreign = ( newScore.foreign * extraValue) / 100 
        }
      }

      else if ( extraSubject == "프랑스어") {


        if ( score.foreign.name == "프랑스어") {
          extraScore.foreign = ( newScore.foreign * extraValue) / 100 
        }

      }

      else if ( extraSubject == "한문") {

        if ( score.foreign.name == "한문") {
          extraScore.foreign = ( newScore.foreign * extraValue) / 100 
        }

      }

      else if ( extraSubject == "수가 / 과탐") {
        
        console.log("수가 /가탐 으로 들어오긴해!")

        console.log(score.math.type)

        if ( score.math.type == "가") extraScore.math = ( newScore.math * extra1) / 100 

        if ( score.line == "자연") {
          extraScore.tamgu1 = ( newScore.tamgu1.score * extra2 ) / 100
          extraScore.tamgu2 = ( newScore.tamgu2.score * extra2 ) / 100 
        }


      }

      else if ( extraSubject == "수가 / 수나") {

        if ( score.math.type == "가") {
          extraScore.math = ( newScore.math * extra1) / 100 
        }
        else if ( score.math.type == "나") {
          extraScore.math = ( newScore.math * extra2) / 100 
        }

      }

      else if ( extraSubject == "수가 / 과탐 1과목") {

      

      }

      else if ( extraSubject == "과탐 / 사탐") {

        if ( score.line == "자연") {

          extraScore.tamgu1 = ( newScore.tamgu1.score * extra1 ) / 100
          extraScore.tamgu2 = ( newScore.tamgu2.score * extra1 ) / 100 

        }

        else if ( score.line == "인문") {

          extraScore.tamgu1 = ( newScore.tamgu1.score * extra2) / 100
          extraScore.tamgu2 = ( newScore.tamgu2.score * extra2) / 100 

        }

      }

      else if( extraSubject == "사탐 / 제2외한") {

        if ( score.line == "인문") {

          extraScore.tamgu1 = ( newScore.tamgu1.score * extra1) / 100
          extraScore.tamgu2 = ( newScore.tamgu2.score * extra1) / 100
          extraScore.foreign = ( newScore.foreign.score * extra2) / 100 
        }

      }

      else if ( extraSubject == "수가 / 국어") {

        if ( score.math.type == "가") {
          extraScore.math = ( newScore.math * extra1 ) / 100
        }
        
        extraScore.korean = ( newScore.korean * extra2 ) / 100 
      }

      else if ( extraSubject == "제2외국어/한문") {

        extraScore.foreign = ( newScore.foreign.score * extraValue ) / 100
      }

      else if ( extraSubject == "수가 / 과탐 / 사탐") {

        

      }

      else if ( extraSubject == "수가 / 과탐I / 과탐Ⅱ") {


      }

      else if ( extraSubject == "영어 1등급 / 2등급") {

        if ( score.english.grade == 1) {
          extraScore.english = ( newScore.english * extra1 ) / 100
        }
        else if ( score.english.grade == 2 ) {
          extraScore.english = ( newScore.english * extra2 ) / 100 
        }


      }
    }

    else if ( extraType == "% 감산") {
      
      if ( extraSubject == "수나") {
        console.log("여기맞잖아!@!@)$(#*$)#($*#)(*")
        extraScore.math = -1 * ( newScore.math * extraValue) / 100 
      }
    }
    
    else if ( extraType == "점수 가산") {

      if ( extraSubject == "화학II,생명과학II") {


      }

      else if ( extraSubject == "수가") {

        if ( score.math.type == "가") extraScore.math = extraValue

      }

      else if ( extraSubject == "과탐") {

        if ( score.line == "자연") {
          extraScore.tamgu1 = extraValue
          extraScore.tamgu2 = extraValue 
      }

      else if ( extraSubject == "수가 / 과탐") {

        if ( score.math.type == "가"){
          extraScore.math = extra1
        }
        if ( score.line == "자연") {
          extraScore.tamgu1 = extra2
          extraScore.tamgu2 = extra2 
        }

      }
    }

    else if ( extraType == "% + 점수 가산") {

      if ( extraSubject == "수가 / 과탐") {

        if ( score.math.type == "가") {
          extraScore.math = ( newScore.math * extra1) / 100
        }

        if ( score.line == "자연") {
          extraScore.tamgu1 = extra2
          extraScore.tamgu2 = extra2 
        }

      }

    }
  }
    
    else {

      if ( extraPoint == "+ [ 수가 ( 개인 취득 표준점수 / 전국최고 표준점수 ) x 10 ]") {


      }

      else if ( extraPoint == "수가 10% / 과탐(상위 3개영역에 포함될 경우) 10점 가산") {

        
        
      }

      else if ( extraPoint == "수가 선택시 1등급 상향") {

        // 먼저 처리 해줌 
      }

      else if( extraPoint == "제2외/한문 3등급 이하부터 차등 감점(0.5, 1, 1.5, 2, 2.5, 3, 3.5)") {

        if (score.foreign.grade >= 3 ) {
          extraScore.foreign = -0.5 * ( score.foreign.grade - 2)
        }

      }

      else if (extraPoint == "수학가/나 4등급 이하부터 차등 감점(0.4, 0.8, 1.2, 1.6, 2, 2.4)") {

        if ( score.math.grade >= 4 ) {
          extraScore.math = -0.4 * ( score.math.grade - 3 )
        }

      }

      else if (extraPoint == "수가 10%, 물Ⅱ, 화Ⅱ, 생Ⅱ 중 최상위 한 과목 5%") {

        if ( score.math.type == "가"){
          extraScore.math = newScore.math * 0.1
        }

        if ( score.tamgu1.name == ("물리2") || score.tamgu1.name == "화학2" || score.tamgu1.name =="생물2") {


        }

        
      }


    }


    console.log("가산점 구하기 성공!")

    const totalScore = {
      korean : newScore.korean + extraScore.korean,
      math : newScore.math + extraScore.math,
      english : newScore.english + extraScore.english,
      tamgu : 0,
      history : newScore.history + extraScore.history,
      foreign : newScore.foreign.score + extraScore.foreign
    }

    console.log("탐구반영은 따로 구해보자")

    /**
     * 탐구 반영 갯수에 따라서 달라진다
     */
    var tamguList = []

    var tamgu1 = newScore.tamgu1.score + extraScore.tamgu1
    var tamgu2 = newScore.tamgu2.score + extraScore.tamgu2
    var foreign = totalScore.foreign

    const tamguReplace = majorData.metadata.tamguReplace

    if ( tamguReplace == "사과 1과목 대체 가능" ) {
      tamguList = [tamgu1, tamgu2, foreign]
    }
    else if ( tamguReplace == "과 1과목 대체 가능" && score.line =="자연") {
      tamguList = [tamgu1, tamgu2, foreign]
    }
    else if ( tamguReplace == "사 1과목 대체 가능" && score.line =="인문"){
      tamguList = [tamgu1,tamgu2, foreign]
    }
    else tamguList = [tamgu1,tamgu2]


    console.log("tamguLisr함보자")
    console.log(tamguList)

    tamguList.sort(function(a, b) { 
      return b - a
    })

    if ( majorData.metadata.tamguNumber == 1 ) {

      totalScore.tamgu = tamguList[0]
    }
    
    else if ( majorData.metadata.tamguNumber == 2 ) {

      totalScore.tamgu = ( tamguList[0] + tamguList[1] ) / 2
    }
    
    console.log("반영비율별로해서 구해보자")

    /**
     * 반영비율별로 해서 구해보자!
     */
    const reflectionSubject = majorData.metadata.reflectionSubject

    console.log(reflectionSubject)

    var totalSum = 0

    if ( reflectionSubject == "국") {
      totalSum = totalScore.korean 
    }

    else if ( reflectionSubject == "국+수+영") {
      totalSum = totalScore.korean + totalScore.math + totalScore.english
    }
    else if ( reflectionSubject == "국+수+영+탐+한") {
      totalSum = totalScore.korean + totalScore.math + totalScore.english + totalScore.tamgu + totalScore.history 
    }
    else if ( reflectionSubject == "국+수+영+탐") {
      console.log("반영비율도 에러가 나냐..")
      totalSum = totalScore.korean + totalScore.math + totalScore.english + totalScore.tamgu
    }

    else if ( reflectionSubject == "국+수+영+한") {
      totalSum = totalScore.korean + totalScore.math + totalScore.english + totalScore.history 
    }
    else if ( reflectionSubject == "국+수+탐") {
      totalSum = totalScore.korean + totalScore.math + totalScore.tamgu 
    }

    else if ( reflectionSubject== "국+영+탐"){
      totalSum = totalScore.korean + totalScore.english + totalScore.tamgu 
    }

    else if ( reflectionSubject == "국+탐") {
      totalSum = totalScore.korean + totalScore.tamgu 
    }
    else if ( reflectionSubject == "수") {
      totalSum = totalScore.math 
    }
    else if ( reflectionSubject == "수+영+탐") {
      totalSum = totalScore.math + totalScore.english + totalScore.tamgu 
    }

    else if ( reflectionSubject == "( 영,한 중 택1 )+(국,수,탐 중 택2 )") {
      const scoreList1 = [totalScore.english , totalScore.history]
      const scoreList2 = [totalScore.korean, totalScore.math, totalScore.tamgu]

      scoreList1.sort(function(a, b) { 
        return b - a
      })
      scoreList2.sort(function(a, b) { 
        return b - a
      })

      totalSum = scoreList1[0] + scoreList2[0] + scoreList2[1]
    }

    else if ( reflectionSubject == "( 국,수,영 중 택1 ) + ( 나머지 영역,탐 중 택1 )") {

      const scoreList1 = [totalScore.korean, totalScore.math, totalScore.english]
      const scoreList2 = [totalScore.history , totalScore.tamgu]

      
      scoreList1.sort(function(a, b) { 
        return b - a
      })
      scoreList2.sort(function(a, b) { 
        return b - a
      })

      totalSum = scoreList1[0] + scoreList2[0]

    }
    else if ( reflectionSubject == "국,수,영,탐 중 택2"){

      console.log("여기가 문제가 아니라고?")

      const scoreList = [totalScore.korean , totalScore.math, totalScore.english , totalScore.tamgu]
      
      scoreList.sort(function(a, b) { 
        return b - a
      })

      console.log("여기가 문제야!")
     
      totalSum = scoreList[0] + scoreList[1]

    }
    else if ( reflectionSubject == "국,수,영,탐 중 택3") {

      const scoreList = [totalScore.korean, totalScore.english , totalScore.math, totalScore.tamgu]

      scoreList.sort(function(a, b) { 
        return b - a
      })

      console.log("asldkfjasldkfjasdlkfjasldkfjaslkdfj")

      totalSum = scoreList[0] + scoreList[1] + scoreList[2]
    }

    else if ( reflectionSubject == "국,수,영,탐,제2외국어 중 택3") {

      const scoreList = [totalScore.korean, totalScore.math, totalScore.english , totalScore.tamgu, totalScore.foreign]

      scoreList.sort(function(a, b) { 
        return b - a
      })

      totalSum = scoreList[0] + scoreList[1] + scoreList[2]

    }
    else if ( reflectionSubject == "국,수,영,탐,한 중 택3"){

      console.log("국수영탐한중택3 여기 맞아?")
      const scoreList = [ totalScore.korean , totalScore.math , totalScore.english ,totalScore.tamgu , totalScore.history]

      scoreList.sort(function(a, b) { 
        return b - a
      })

      totalSum = scoreList[0] + scoreList[1] + scoreList[2]

    }

    else if ( reflectionSubject == "국,수,영,탐,한 중 택4") {

      const scoreList = [ totalScore.korean, totalScore.math, totalScore.english ,totalScore.tamgu, totalScore.history]

      scoreList.sort(function(a, b) { 
        return b - a
      })

      totalSum = scoreList[0] + scoreList[1] + scoreList[2] + scoreList[3]

    }

    else if ( reflectionSubject == "국+( 수,영,탐 중 택2 )") {

      const scoreList = [ totalScore.math, totalScore.english, totalScore.tamgu]

      scoreList.sort(function(a, b) { 
        return b - a
      })

      totalSum = totalScore.korean + scoreList[0] + scoreList[1]

    }
    else if ( reflectionSubject == "국+( 수,영,탐,한 중 택1 )") {

      const scoreList =[ totalScore.math ,totalScore.english , totalScore.tamgu, totalScore.history]

      scoreList.sort(function(a, b) { 
        return b - a
      })

      console.log("이 구역의 최고점은!")
      console.log(scoreList[0])

      totalSum = totalScore.korean + scoreList[0]
    }
    else if ( reflectionSubject == "국+영+( 수,탐 중 택1 )") {

      const scoreList = [ totalScore.math, totalScore.tamgu]

      scoreList.sort(function(a, b) { 
        return b - a
      })

      totalSum = totalScore.korean + totalScore.english + scoreList[0]

    }

    else if ( reflectionSubject == "국+탐+( 수,영 중 택1 )") {

      const scoreList = [totalScore.math , totalScore.english]

      scoreList.sort(function(a, b) { 
        return b - a
      })

      totalSum = totalScore.korean + totalScore.tamgu + scoreList[0]
    }
    else if ( reflectionSubject == "수+( 국,영,탐 중 택1 )") {

      const scoreList = [ totalScore.korean, totalScore.english , totalScore.tamgu]

      scoreList.sort(function(a, b) { 
        return b - a
      })

      totalSum = totalScore.math + scoreList[0]
    }

    else if ( reflectionSubject == "영+탐+(국,수 중 택1)") {

      const scoreList = [ totalScore.korean, totalScore.math]

      console.log(scoreList[0])

      scoreList.sort(function(a,b) {
        return b - a
      })

      console.log(scoreList[0])
      totalSum = totalScore.english + totalScore.tamgu + scoreList[0]
    }

    else if ( reflectionSubject == "수+( 국,영,탐 중 택2 )") {

      const scoreList = [totalScore.korean, totalScore.english, totalScore.tamgu]

      scoreList.sort(function(a, b) { 
        return b - a
      })

      totalSum = totalScore.math + scoreList[0] + scoreList[1]
    }

    else if ( reflectionSubject == "수+( 국,영,탐,한 중 택1 )") {

      const scoreList = [totalScore.korean, totalScore.english, totalScore.tamgu, totalScore.history]

      scoreList.sort(function(a, b) { 
        return b - a
      })

      totalSum = totalScore.math + scoreList[0]
    }
    else if ( reflectionSubject == "수+영+( 국,탐 중 택1 )") {

      console.log("수+영+국탐중택1로 들어왔엉!")

      const scoreList = [ totalScore.korean, totalScore.tamgu]

      scoreList.sort(function(a, b) { 
        return b - a
      })

      totalSum = totalScore.math + totalScore.english + scoreList[0]
    }

    else if ( reflectionSubject == "영+( 국,수,탐 중 택2)"){

      const scoreList = [totalScore.korean, totalScore.math, totalScore.tamgu]

      scoreList.sort(function(a,b) {
        return b - a
      })

      totalSum = totalScore.english + scoreList[0] + scoreList[1]

    }
    else if ( reflectionSubject == "수+탐+( 국,영 중 택1 )") {

      const scoreList = [ totalScore.korean , totalScore.english]

      scoreList.sort(function(a, b) { 
        return b - a
      })

      totalSum = totalScore.math + totalScore.tamgu + scoreList[0]

    }

    else if ( reflectionSubject == "영+( 국,수,탐 중 택2 )") {

      const scoreList = [totalScore.korean, totalScore.math , totalScore.tamgu]

      scoreList.sort(function(a, b) { 
        return b - a
      })

      totalSum = totalScore.english + scoreList[0] + scoreList[1]
    }

    else if ( reflectionSubject == "영+(국,수,탐 중 택2)") {

      
      const scoreList = [totalScore.korean, totalScore.math , totalScore.tamgu]

      scoreList.sort(function(a, b) { 
        return b - a
      })

      totalSum = totalScore.english + scoreList[0] + scoreList[1]
    }

    else if ( reflectionSubject == "영+탐+( 국,수 중 택1 )") {
      const scoreList = [totalScore.math, totalScore.korean]

      scoreList.sort(function(a, b) { 
        return b - a
      })

      totalSum = totalScore.english + totalScore.tamgu + scoreList[0]
    }

    else if ( reflectionSubject == "영+탐+한+( 국,수 중 택1 )"){

      const scoreList = [ totalScore.korean, totalScore.math]

      scoreList.sort(function(a, b) { 
        return b - a
      })

      totalSum = totalScore.english + totalScore.tamgu + totalScore.history + scoreList[0]
    }

    else if ( reflectionSubject == "탐+( 국,수,영 중 택1 )") {

      const scoreList = [ totalScore.korean, totalScore.math, totalScore.english]

      scoreList.sort(function(a, b) { 
        return b - a
      })

      totalSum = totalScore.tamgu + scoreList[0]
    }

    else if ( reflectionSubject == "탐+( 국,수,영 중 택2 )"){

      const scoreList = [ totalScore.korean, totalScore.math, totalScore.english]

      scoreList.sort(function(a, b) { 
        return b - a
      })

      totalSum = totalScore.tamgu + scoreList[0] + scoreList[1]
    }
    else if ( reflectionSubject == "탐+한+( 국,수,영 중 택2 )") {

      const scoreList = [ totalScore.korean, totalScore.math, totalScore.english]

      scoreList.sort(function(a, b) { 
        return b - a
      })

      totalSum = totalScore.tamgu + totalScore.history + scoreList[0] + scoreList[1]


    }

    else if ( reflectionSubject == "우수영역 순서대로 50% + 30% + 20%") {

      const scoreList = [totalScore.korean, totalScore.math, totalScore.english ,totalScore.tamgu, totalScore.history]

      scoreList.sort(function(a, b) { 
        return b - a
      })

      totalSum = scoreList[0] * 0.5 + scoreList[1] * 0.3 + scoreList[2] * 0.2
    }

    else if ( reflectionSubject == "( 국, 수가나 우수영역 순서대로 35% + 25% ) + 영 20% + 탐 20%") {

      const scoreList = [ totalScore.korean, totalScore.math]

      scoreList.sort(function(a, b) { 
        return b - a
      })

      totalSum = scoreList[0] * 0.35 + scoreList[1] * 0.25 + totalScore.english * 0.2 + totalScore.tamgu * 0.2

    }

    else if ( reflectionSubject == "( 국, 수가나 우수영역 순서대로 40% + 20% ) + 영 25% + 탐 15%") {

      const scoreList = [ totalScore.korean, totalScore.math]

      scoreList.sort(function(a, b) { 
        return b - a
      })

      totalSum = scoreList[0] * 0.4 + scoreList[1] * 0.2 + totalScore.english * 0.25 + totalScore.tamgu * 0.15

    }

    else if ( reflectionSubject == "우수영역 순서대로 45% + 40% + 15%") {

      const scoreList = [totalScore.korean, totalScore.english, totalScore.math , totalScore.tamgu, totalScore.history]

      scoreList.sort(function(a, b) { 
        return b - a
      })

      totalSum = scoreList[0] * 0.45 + scoreList[1] * 0.4 + scoreList[2] * 0.15


    }

    else if ( reflectionSubject == "우수영역 순서대로 80% ( 국,수,영 중 택1 ) + 20% ( 나머지 영역,탐 중 택1 )") {

      const scoreList1 = [totalScore.korean, totalScore.math, totalScore.english]
      const scoreList2 = [totalScore.history, totalScore.tamgu]

      scoreList1.sort(function(a, b) { 
        return b - a
      })

      scoreList2.sort(function(a, b) { 
        return b - a
      })

      totalSum = scoreList1[0] * 0.8 + scoreList2[0] * 0.2 

    }

    else {
      console.log("에러야 에러 순서에서 에러")
      totalSum = -1
    }

    console.log("special option = " + specialOption)


    // 마지막으로 totalSum을 조정해보장
    if ( majorData.gradeToScore.history.way == "가산점") {
      console.log("한국사 가산점 되지롱")
      totalSum += totalScore.history
    
    }

    if ( majorData.gradeToScore.english.way == "가산점") {
      console.log("영어 가산점 되지롱")
      totalSum += totalScore.english
    }

    if ( major_perfectScore < totalSum ) {
      if ( specialOption.indexOf("가산점 부여 후 점수 100 초과 시 100으로 반영") >= 0 ) {
        totalSum = major_perfectScore
      }
  
      if ( specialOption.indexOf("전형총점 초과 불가") >= 0 ) {
        totalSum = major_perfectScore 
      }

  

      if ( extraPoint.indexOf("가산점 부여 후 점수 100 초과 시 100으로 반영") >=0 ) {
        totalSum = major_perfectScore
      }
    
    }



    

    if ( isNaN(basicScore) == false ) totalSum += basicScore

    console.log("순서까지 다 정했어!")

    console.log("newScore")
    console.log(newScore)
    console.log("perfectScore")
    console.log(perfectScore)
    console.log("extraScore")
    console.log(extraScore)
    console.log("totalScore")
    console.log(totalScore)
    console.log(score.line + "합계 = " + totalSum)
  

    if ( create == true ) {


      const recommendations = await majorDataService.findRecommendations(totalSum)

      var total_sum = Math.round(totalSum)


      const modelObj = {
        score : newScore,
        majorDataId : majorData.id,
        userId : score.userId,
        perfectScore,
        extraScore : extraScore,
        totalScore : total_sum,
        recommendations,
        actualPerfectScore : major_perfectScore
      }

      console.log("계산결과값!")
      console.log(modelObj)

      return modelObj
    }
    else {
      return totalSum
    }


  }

  static async getScoreByGrade ( score, majorData ) {

    const univName = majorData.major.univName

    var translationScore = 0

    var koreanScore = 0
    var englishScore = 0
    var tamguScore = 0
    var historyScore = 0
    var mathScore = 0
    var foreignScore = 0

    if( univName.indexOf("경동대") >= 0) {
      const tamgu = Math.max(score.tamgu1.grade, score.tamgu2.grade)

      const originalGrade = ( score.korean.grade + score.math.grade + score.english.grade + tamgu) / 4

      const grade = Math.floor(originalGrade)

      if ( grade == 9) translationScore = 630
      else {
        translationScore = 700 - ( grade - 1 ) * 8 
      }

      console.log("경동대의 리턴값!" + translationScore)

      return translationScore

    }
    else if ( univName == "광주여대") {

      const tamgu = Math.max(score.tamgu1.grade, score.tamgu2.grade)

      koreanScore =  ( 450 - 10 * ( score.korean.grade - 1 ) ) / 3
      mathScore = ( 450 - 10 * ( score.math.grade - 1 ) ) / 3
      tamguScore = ( 450 - 10 * ( tamgu - 1) ) / 3
      englishScore = 150 - 5 * ( score.english.grade - 1 )

      translationScore = koreanScore + mathScore + tamguScore + englishScore
    }

    else if ( univName.indexOf("세한대") >= 0) {

      const tamgu = Math.max(score.tamgu1.grade, score.tamgu2.grade)
      var difference = 0
      var perfectScore = 0

      if ( majorData.metadata.perfectScore == 700 ) {
        perfectScore = 700
        difference = 14
      }
      else {
        perfectScore = 600
        difference = 12
      }

      koreanScore = perfectScore - difference * ( score.korean.grade - 1 ) / 4
      englishScore = perfectScore - difference * (score.english.grade - 1 ) / 4
      tamguScore = perfectScore - difference * (tamgu-1 ) / 4
      mathScore = perfectScore - difference * ( score.math.grade -1) / 4

      translationScore = koreanScore + englishScore + tamguScore + mathScore 


    }

    else if ( univName == "송원대") {

      if ( majorData.major.group == "가") {

        koreanScore = 360 - ( score.korean.grade -1 )
        mathScore = 270 - ( score.math.grade -1 )
        englishScore = 225 - (score.english.grade -1 )
        historyScore = 45

        if ( score.history.grade > 4 && score.history.grade < 8) historyScore = 44
        else if ( score.history.grade > 7 ) historyScore = 43

        translationScore = koreanScore + mathScore + englishScore + historyScore 

      }

      else if ( majorData.major.group == "나") {

        const tamgu = Math.max(score.tamgu1.grade, score.tamgu2.grade)

        koreanScore = 300 - ( score.korean.grade -1 )
        englishScore = 200 - ( score.english.grade - 1)
        mathScore = 200 - ( score.math.grade -1 )
        tamguScore = 250 - ( tamgu - 1 )
        historyScore = 50

        if ( score.history.grade > 4 && score.history.grade < 8) historyScore = 49
        else if ( score.history.grade > 7 ) historyScore = 48

        translationScore = koreanScore + englishScore + mathScore + tamguScore + historyScore 
      }

    }

    else if ( univName == "유원대") {

      var difference = 0
      var perfectScore = 40

      if ( majorData.metadata.perfectScore == 1000 ) {
        perfectScore = 1000
      }
      else {
        perfectScore = 600
      }

      const tamgu = Math.max(score.tamgu1.grade, score.tamgu2.grade)

      koreanScore = (perfectScore - difference * (score.korean.grade - 1 ) ) / 4
      englishScore = ( perfectScore - difference * ( score.english.grade -1 ) ) / 4
      mathScore = ( perfectScore - difference * ( score.math.grade -1 ) ) / 4
      tamguScore = ( perfectScore - difference * ( tamgu - 1 )) / 4
      historyScore = ( perfectScore - difference * ( score.history.grade -1 )) / 4

      let scoreList = [koreanScore, englishScore, mathScore, tamguScore, historyScore ]

      scoreList.sort(function(a, b) { 
        return b - a
      })
      
      for ( let i = 0 ; i < 4 ; i++){
        translationScore += scoreList[i]
      }
    }
    
    else if ( univName == "평택대") {

      const tamgu = Math.max(score.tamgu1.grade, score.tamgu2.grade)

      if ( score.korean.grade < 8 ) koreanScore = 350 - 35 * ( score.korean.grade -1 )
      else if ( score.korean.grade == 8 ) koreanScore = 80

      if (score.math.grade < 8 ) mathScore = 350 - 35 * ( score.math.grade - 1 )
      else if ( score.math.grade == 8 ) mathScore = 80

      const maxScore = Math.max(koreanScore,mathScore)

      if ( score.english.grade < 6 ) englishScore = 350 - 10 * ( score.english.grade - 1 )
      else if ( score.english.grade == 6 ) englishScore = 250
      else if ( score.english.grade == 7 ) englishScore = 230
      else if ( score.english.grade == 8 ) englishScore = 180

      if ( tamgu < 6 ) tamguScore = 350 - 10 * ( tamgu - 1 )
      else if ( tamgu == 6 ) tamguScore = 210
      else if ( tamgu == 7 ) tamguScore = 190
      else if ( tamgu == 8 ) tamguScore = 100

      translationScore = maxScore + englishScore + tamguScore 
    }

    else if ( univName == "호원대") {

      const tamgu = Math.max(score.tamgu1.grade, score.tamgu2.grade)

      koreanScore = ( 600 - 20 * ( score.korean.grade -1 )) / 2
      englishScore = ( 600 - 20 * (score.english.grade -1 )) / 2
      mathScore = ( 600 - 20 * ( score.math.grade -1 )) / 2
      tamguScore = ( 600 - 20 * ( tamgu - 1 )) / 2

      let scoreList = [ koreanScore, englishScore, mathScore, tamguScore ]
      scoreList.sort(function(a, b) { 
        return b - a
      })

      translationScore = scoreList[0] + scoreList[1]

    }

    else if ( univName == "칼빈대") {

      if ( score.korean.grade == 1) koreanScore = 30
      else if ( score.korean.grade == 2 ) koreanScore = 29.1
      else koreanScore = 29.1 - ( score.korean.grade - 2 ) * 1.5

      translationScore = koreanScore 

    }
    
    else if ( univName == "서울기독대") {

      const tamgu = Math.max(score.tamgu1.grade, score.tamgu2.grade)

      console.log("tamgu man " + tamgu )
      const newAverageGrade = score.korean.grade * 0.4 + score.english.grade * 0.3 + tamgu * 0.3

      console.log(newAverageGrade)

      if ( majorData.major.line == "예체능") translationScore = 200 - Math.floor(newAverageGrade) * 10 
      else translationScore = 50 - 2.5 * Math.floor(newAverageGrade)

      console.log(translationScore)


    }

    const newScore = {
      korean : koreanScore,
      english : englishScore,
      math : mathScore,
      tamgu1 : {
        score : tamguScore,
        name : score.tamgu1.name},
      
      tamgu2 : {
        score : tamguScore,
        name : score.tamgu2.name
      },
      history : historyScore,
      foreign : {
        score :foreignScore,
        name : score.foreign.name}
    }

    return newScore 

  }

  static async gayaScore ( score,majorData ) {



    let newScore = {

      korean : 0,

      english : 0,

      tamgu1 : {
        score : 0,
        name : score.tamgu1.name
      }, 

      tamgu2 : {
        score : 0,
        name : score.tamgu2.name
      }, 

      math : 0 , 
      history : 0 , 
      foreign : {
        score : 0,
        name :score.foreign.name
      } , 
      
      total : 0 
    } 

    newScore.korean = await reportController.getScoreByPercentile(score.korean.percentile) * 0.4
    newScore.math = await reportController.getScoreByPercentile(score.math.percentile) * 0.4
    newScore.tamgu1.score = await reportController.getScoreByPercentile(score.tamgu1.percentile) / 10
    newScore.tamgu2.score = await reportController.getScoreByPercentile(score.tamgu2.percentile) / 10

    newScore.english = 280 - 6 * ( score.english.grade -1 ) * 6
    
    if ( score.history.grade < 4 ) newScore.history = 70 - score.history.grade + 1
    else if ( score.history.grade < 7) newScore.history = 70 - score.history.grade
    else newScore.history = 69 - score.history.grade 

    return newScore

  }

  static async getScoreByPercentile ( percentile ) {

    var returnValue = 0

    if ( percentile >= 96 ) returnValue = 700
    else if ( percentile >=  93 && percentile < 96) returnValue = 685
    else if ( percentile >= 90 && percentile < 93) returnValue = 670
    else if ( percentile >= 80 && percentile < 90 ) returnValue = 655
    else if ( percentile >= 60 && percentile < 80) returnValue = 640
    else if ( percentile >= 30 && percentile < 60 ) returnValue = 625
    else if ( percentile >= 10 && percentile < 30 ) returnValue = 610
    else if ( percentile >= 5 && percentile < 10 ) returnValue = 592.5
    else returnValue = 577.5

    return returnValue 

  }

}
