import { reportService , majorDataService, majorService, scoreService, scoreTransitionService , reportDataService , naesinService } from '../services'
import Joi from '@hapi/joi'

import { createErrorResponse } from '../utils/functions'
import { SCORE_TRANSITION } from '../utils/variables'

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

      if ( majorData.ratio.math.ga == 0 && majorData.ratio.math.na != 0 && score.math.type == "가") throw Error('MATH_NA_NOT_FOUND')
      else if ( majorData.ratio.math.na == 0 &&  majorData.ratio.math.ga != 0 && score.math.type =="나") throw Error('MATH_GA_NOT_FOUND')
      else if ( majorData.ratio.tamgu.science == 0 && majorData.ratio.tamgu.society != 0 && score.line == "자연") throw Error('SOCIETY_NOT_FOUND')
      else if ( majorData.ratio.tamgu.society == 0 && majorData.ratio.tamgu.society != 0 && score.line == "인문") throw Error('SCIENCE_NOT_FOUND')


      const modelObj = await reportController.getScore(score , majorData , true)

      const report = await reportService.create(modelObj)

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

      console.log(SCORE_TRANSITION)
      const id = req.params.id 

      const report = await reportService.findOne({id})

      if ( report == null ) throw Error('REPORT_NOT_FOUND')

      const majorDataId = report.majorDataId

      const reports = await reportService.findAll(majorDataId)

      
      reports.sort(function(a, b){
        return b.totalScore - a.totalScore
      })

      const reportData = await reportDataService.findOne({majorDataId})
      const applicantsNumber = reportData.applicants + Object.keys(reports).length
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


  } catch ( e ) {
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

     /**
      * 1. 들어온 성적, 이용될 만점 구하기 
      */
    var major_perfectScore = majorData.metadata.perfectScore
    const basicScore = majorData.metadata.basicScore
    const specialOption = majorData.metadata.specialOption
    const tamguTranslation = majorData.metadata.tamguTranslation
    const calculationSpecial = majorData.metadata.calculationSpecial
    const tamguReplace = majorData.metadata.tamguReplace
    const reflectionOption = majorData.metadata.reflectionOption

    const highestScore = {
      "국어" : 144,
      "수학가" : 137,
      "수학나" : 137,
      "생활과윤리" : 65,
      "윤리와사상" : 64,
      "한국지리" : 63,
      "세계지리" : 63,
      "동아시아사" : 67,
      "세계사" : 67,
      "경제" : 69,
      "정치와 법" : 69,
      "사회문화" : 71,
      "물리학1" : 64,
      "화학1" : 68,
      "생명과학1" : 71,
      "지구과학1" : 72,
      "물리학2" : 62,
      "화학2" : 70,
      "생명과학2" : 69,
      "지구과학2" : 69,
      "독일어" : 70,
      "프랑스어" : 68,
      "스페인어" : 68,
      "중국어" : 67,
      "일본어" : 69,
      "러시아어" : 68,
      "아랍어" : 86,
      "베트남어" : 75,
      "한문" : 69
    }

    if ( isNaN(basicScore) == false ) major_perfectScore = major_perfectScore - basicScore

    const major_ratio = majorData.ratio

    let perfectScore = {
      korean : major_perfectScore * ( major_ratio.korean / 100 ),
      english : major_perfectScore * (major_ratio.english / 100),
      math : 0,
      tamgu : 0,
      history : major_perfectScore * (major_ratio.history / 100)
    }

  

    const math_type = score.math.type
    const tamgu_type = score.line
    const english_type = major_ratio.english 
    const history_type = major_ratio.history 

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

    if ( majorData.major.univName.indexOf("전남대") >= 0 ) {

      if ( specialOption == "영역별 점수: 국(320) / 수(240) / 탐(240)") {
        perfectScore.korean = 320
        perfectScore.math = 240
        perfectScore.tamgu = 240
      }
      else if ( specialOption == "영역별 점수: 국(240) / 수(320) / 탐(240)"){

        perfectScore.korean = 240
        perfectScore.math = 320
        perfectScore.tamgu = 240
      }
      else if (specialOption == "영역별 점수: 국(400) / 탐(400)") {
        perfectScore.korean = 400
        perfectScore.tamgu = 400
      }
    }

    
    /**
     * 2. 활용 지표와 반영 비율 가지고 각 과목의 변환 점수 구하기 
     */
    const applicationIndicatorType = majorData.metadata.applicationIndicatorType
    const applicationIndicator = majorData.metadata.applicationIndicator

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

    /**
     * 점수를 구해보자 
     */
    var tamgu1TransitionScore = ""
    var tamgu2TransitionScore = ""
    var foreignTransitionScore = ""
    var mathTransitionScore = ""
    var subject1 = ""
    var subject2 = ""

    if ( tamguTranslation.indexOf("탐구 변표사용") >= 0 ) {

      if ( majorData.major.line == "인문") {
        subject1 = "사탐"
        subject2 = "사탐"
      }
      else if ( majorData.major.line == "자연") {
        subject1 = "과탐"
        subject2 = "과탐"
      }
      else if ( majorData.major.line == "공통" || majorData.major.line == "예체능") {
        if ( score.line == "인문") {
          subject1 = "사탐"
          subject2 = "사탐"
        } else {
          subject1 = "과탐"
          subject2 = "과탐"
        }
      }

      if ( majorData.major.univName.indexOf("과학기술원") >= 0  || majorData.major.univName.indexOf("서울대") >= 0) {
        subject1 = score.tamgu1.name
        subject2 = score.tamgu2.name
      }

      for ( let i = 0 ; i < SCORE_TRANSITION.length ; i++ ) {

        if ( SCORE_TRANSITION[i].univName === majorData.major.univName && SCORE_TRANSITION[i].major === majorData.major.majorName && SCORE_TRANSITION[i].subject === subject1) {
          tamgu1TransitionScore = SCORE_TRANSITION[i]
          console.log(tamgu1TransitionScore.score)
        } 

        
        if ( SCORE_TRANSITION[i].univName === majorData.major.univName && SCORE_TRANSITION[i].major === majorData.major.majorName && SCORE_TRANSITION[i].subject === subject2) {
          tamgu2TransitionScore = SCORE_TRANSITION[i]
          console.log(tamgu2TransitionScore.score)
        } 

      }
      
      if ( tamguReplace.length > 1 && score.foreign.score != null) {

        for ( let i = 0 ; i < SCORE_TRANSITION.length ; i++ ) {

          if ( SCORE_TRANSITION[i].univName === majorData.major.univName && SCORE_TRANSITION[i].major === majorData.major.majorName && SCORE_TRANSITION[i].subject === "제2외/한") {
            foreignTransitionScore = SCORE_TRANSITION[i]
            console.log(foreignTransitionScore.score)
          } 

        }
      }
      

      if ( majorData.major.univName.indexOf("서울대") >= 0 ) {


        for ( let i = 0 ; i < SCORE_TRANSITION.length ; i++ ) {

          if ( SCORE_TRANSITION[i].univName === majorData.major.univName && SCORE_TRANSITION[i].subject === subject1) {
            tamgu1TransitionScore = SCORE_TRANSITION[i]
            console.log(tamgu1TransitionScore.score)
          } 
  
          
          if ( SCORE_TRANSITION[i].univName === majorData.major.univName && SCORE_TRANSITION[i].subject === subject2) {
            tamgu2TransitionScore = SCORE_TRANSITION[i]
            console.log(tamgu2TransitionScore.score)
          } 
  
        }

      }
  
    }

    if ( (calculationSpecial == "수가 지원시 변표사용" || calculationSpecial == "수가 선택시 변표사용" ) && score.math.type =="가") {

      for ( let i = 0 ; i < SCORE_TRANSITION.length ; i++ ) {

        if ( SCORE_TRANSITION[i].univName === majorData.major.univName && SCORE_TRANSITION[i] === majorData.major.majorName && SCORE_TRANSITION[i].subject === "수가") {
          mathTransitionScore = SCORE_TRANSITION[i]
          console.log(mathTransitionScore.score)
        } 
      }

    }

    else if ( calculationSpecial == "수나 지원시 변표사용" && score.math.type == "나") {

      for ( let i = 0 ; i < SCORE_TRANSITION.length ; i++ ) {

        if ( SCORE_TRANSITION[i].univName === majorData.major.univName && SCORE_TRANSITION[i] === majorData.major.majorName && SCORE_TRANSITION[i].subject === "수나") {
          mathTransitionScore = SCORE_TRANSITION[i]
          console.log(mathTransitionScore.score)
        } 
      }

    }


    

    //백분위 x (총점에 따른 비율)  [ 국, 수, 탐 ] + 영 + 한
    if ( majorData.major.univName == "가야대") {
      newScore = await reportController.gayaScore(score,majorData)

  
    }

    else if ( reflectionOption == "우수영역 순서대로 80% ( 국,수,영 중 택1 ) + 20% ( 나머지 영역,탐 중 택1 )") {

      const koreanScore = score.korean.percentile
      const englishScore = majorData.gradeToScore.english.score[score.english.grade-1]
      const mathScore = score.math.percentile
      const tamguScore = ( score.tamgu1.percentile + score.tamgu2.percentile ) / 2

      perfectScore.korean = 0
      perfectScore.english = 0
      perfectScore.math = 0 
      perfectScore.tamgu = 0

      const scoreList1 = [ koreanScore, englishScore, mathScore ]

      scoreList1.sort(function(a, b) { 
        return b - a
      })

      if ( scoreList1[0] == koreanScore ) {
        newScore.korean = koreanScore * 8
        perfectScore.korean = 800

        const scoreList2 = [tamguScore, englishScore, mathScore]

        scoreList2.sort(function ( a, b) {
          return b - a
        })

        if ( scoreList2[0] == tamguScore ) {
          newScore.tamgu1.score = tamguScore * 2
          newScore.tamgu2.score = tamguScore * 2
          perfectScore.tamgu = 200
        }

        else if ( scoreList2[0] == englishScore) {
          newScore.english = englishScore * 2
          perfectScore.english = 200 

        }

        else if ( scoreList2[0] == mathScore ) {
          newScore.math = mathScore * 2
          perfectScore.math = 200 
        }
      }
      else if ( scoreList1[0] == englishScore) {
        newScore.english = englishScore * 8
        perfectScore.english = 800

        const scoreList2 = [tamguScore, koreanScore, mathScore]

        scoreList2.sort(function ( a, b) {
          return b - a
        })

        if ( scoreList2[0] == tamguScore ) {
          newScore.tamgu1.score = tamguScore * 2
          newScore.tamgu2.score = tamguScore * 2
          perfectScore.tamgu = 200
        }

        else if ( scoreList2[0] == koreanScore) {
          newScore.korean = koreanScore * 2
          perfectScore.korean = 200 

        }

        else if ( scoreList2[0] == mathScore ) {
          newScore.math = mathScore * 2
          perfectScore.math = 200 
        }
      }
      else if ( scoreList1[0] == mathScore ) {
        newScore.math = mathScore * 8
        perfectScore.math = 800

        const scoreList2 = [tamguScore, koreanScore, englishScore]

        scoreList2.sort(function ( a, b) {
          return b - a
        })

        if ( scoreList2[0] == tamguScore ) {
          newScore.tamgu1.score = tamguScore * 2
          newScore.tamgu2.score = tamguScore * 2
          perfectScore.tamgu = 200
        }

        else if ( scoreList2[0] == koreanScore) {
          newScore.korean = koreanScore * 2
          perfectScore.korean = 200 

        }

        else if ( scoreList2[0] == englishScore ) {
          newScore.english = englishScore * 2
          perfectScore.english = 200 
        }
      }
    }

    else if ( reflectionOption == "( 국, 수가나 우수영역 순서대로 40% + 20% ) + 영 25% + 탐 15%") {

      const scoreList = [ score.korean.percentile, score.math.percentile]

      scoreList.sort ( function ( a,b ) {
        return b - a
      })

      if ( scoreList[0] == score.korean.percentile )  {
        newScore.korean = score.korean.percentile * 4
        newScore.math = score.math.percentile * 2
      } else {
        newScore.math = score.math.percentile * 4
        newScore.korean = score.korean.percentile * 2

      }

      newScore.tamgu1.score = score.tamgu1.percentile * 1.5
      newScore.tamgu2.score = score.tamgu2.percentile * 1.5

      newScore.english = majorData.gradeToScore.english.score[score.english.grade-1] * 2.5
    }

    else if (reflectionOption =="우수영역 순서대로 50% + 30% + 20%") {
      const scoreList = [ {
        subject : "국어",
        score : score.korean.percentile
      },{
        subject : "수학",
        score : score.math.percentile
      }, {
        subject : "영어",
        score : majorData.gradeToScore.english.score[score.english.grade-1]
      },{
        subject : "탐구",
        score : Math.max(score.tamgu1.percentile, score.tamgu2.percentile)
      }]

              
      scoreList.sort(function(a, b) { 
        return b.score - a.score
      })

      for ( let i = 0 ; i < 3 ; i++){

        var reflectionScore = [5,3,2]

        if ( scoreList[i].subject == "국어") {
          newScore.korean = scoreList[i].score * reflectionScore[i]
        }
        else if ( scoreList[i].subject == "수학") {
          newScore.math = scoreList[i].score * reflectionScore[i]
        } 

        else if (scoreList[i].subject =="영어") {
          newScore.english = scoreList[i].score * reflectionScore[i]
        }

        else if ( scoreList[i].subject == "탐구") {
          newScore.tamgu1.score = scoreList[i].score * reflectionScore[i]
          newScore.tamgu2.score = scoreList[i].score * reflectionScore[i]
        }     
       }

    }

    
    else if ( majorData.major.univName.indexOf("가천대")>= 0 && majorData.major.majorName != "한의예과" && majorData.major.majorName != "의예과" ) {

      if ( majorData.ratio.korean == "45/40/15") {

      
        var mathScore = score.math.percentile
        var englishScore = majorData.gradeToScore.english.score[score.english.grade-1]
        var tamguScore = Math.max(score.tamgu1.percentile , score.tamgu2.percentile)

        if ( majorData.metadata.extraPoint.length > 3 ) {
          if ( score.math.type == "가") mathScore *= 1.05
          if ( score.line == "자연") tamguScore *= 1.03
        }


        const scoreList = [ {
          score : score.korean.percentile,
          subject : "국어"
        },{
          score : englishScore,
          subject : "영어"
        }, {
          score : mathScore,
          subject : "수학",
         },{
           score : tamguScore,
           subject : "탐구"
         }]
        
        scoreList.sort(function(a, b) { 
          return b.score - a.score
        })

        for ( let i = 0 ; i < 4 ; i++){

          var reflectionScore = [4.5,4,1.5,0]
          
          if ( scoreList[i].subject === "국어"){
            newScore.korean = score.korean.percentile * reflectionScore[i]
            perfectScore.korean = reflectionScore[i] * 100
          }
          else if ( scoreList[i].subject === "영어") {
            newScore.english = englishScore * reflectionScore[i]
            perfectScore.english = reflectionScore[i] * 100
          }
          else if ( scoreList[i].subject === "수학") {
            newScore.math = score.math.percentile * reflectionScore[i]
            perfectScore.math = reflectionScore[i] * 100 
          }
          else if ( scoreList[i].subject === "탐구") {

            newScore.tamgu1.score = score.tamgu1.percentile * reflectionScore[i]
            newScore.tamgu2.score = score.tamgu2.percentile * reflectionScore[i]

            perfectScore.tamgu = reflectionScore[i] * 100 
          }
      
        }


      }
      else if ( majorData.ratio.korean == "35/25") {

        var mathScore = score.math.percentile

        if ( majorData.metadata.extraPoint.length > 3 ) {

          if ( score.math.type == "가") mathScore *= 1.05
        }

        const scoreList = [ {
          score : score.korean.percentile ,
          subject : "국어"
        }, {
          score : mathScore,
          subject : "수학"
        }]

        scoreList.sort(function(a,b) {
          return b.score - a.score 
        })

        for ( let i = 0 ; i < 2 ; i++ ) {

          var reflectionScore = [3.5 ,2.5]

          if ( scoreList[i].subject === "국어") {
            newScore.korean = score.korean.percentile * reflectionScore[i]
            perfectScore.korean = reflectionScore[i] * 100 
          }
          else if ( scoreList[i].subject === "수학") {
            newScore.math = score.math.percentile * reflectionScore[i]
            perfectScore.math = reflectionScore[i] * 100
          }
        }

      
        newScore.english = majorData.gradeToScore.english.score[score.english.grade-1] * 2
        newScore.tamgu1.score = score.tamgu1.percentile * 2
        newScore.tamgu2.score = score.tamgu2.percentile * 2
      }
      
    }

    else if ( majorData.major.univName == "서강대") {
      newScore.korean = score.korean.score * 1.1
      newScore.math = score.math.score * 1.4
      newScore.tamgu1.score = score.tamgu1.score * 1.2
      newScore.tamgu2.score = score.tamgu2.score * 1.2
    }
    
    else if ( majorData.major.univName == "고려대(세종)") {

      const englishScore = majorData.gradeToScore.english.score[score.english.grade-1]

      const highestKorean = highestScore["국어"]
      const highestMath = highestScore[`수학${math_type}`]

      const highestTamgu = tamgu1TransitionScore.score.value[0]
      
      const tamgu1 = tamgu1TransitionScore.score.value[100-score.tamgu1.percentile]
      const tamgu2 = tamgu2TransitionScore.score.value[100-score.tamgu2.percentile]

      var value = 0

      if ( specialOption == "특정값: { ( 국어 표점 최고점 + 수학 표점 최고점 + 100 ) x 0.286 } + ( 탐구 변표 최고점 x 2 x 0.142 )"){
        value = ( highestKorean * perfectScore.korean + highestMath * perfectScore.math + 100 * perfectScore.english + highestTamgu * 2 * perfectScore.tamgu) / 1000
      }

      else if ( specialOption == "특정값: { ( 수학 표점 최고점 + 100 ) x 0.333 } + [ { 국어 표점 최고점 + ( 탐구 변표 최고점 x 2 ) } x 0.167 ] ") {
        value = ( highestMath + 100 ) * 0.333 + ( highestKorean + highestTamgu * 2 ) * 0.167
      }


      else if ( specialOption == "특정값: { ( 국어 표점 최고점 + 100 ) x 0.4 } + { ( 수학 표점 최고점 x 0.2 ) or ( 탐구 변표 최고점 x 2 x 0.2 ) }"){


        var pickedScore = 0
        if ( ( score.tamgu1.percentile + score.tamgu2.percentile ) / 2 > score.math.percentile ) pickedScore = highestTamgu * 2 * 0.2
        else pickedScore = highestMath * 0.2
        value = ( highestKorean + 100 ) * 0.4 + pickedScore
      }


      newScore.korean = score.korean.score * perfectScore.korean / value
      newScore.english = englishScore * perfectScore.english / value
      newScore.math = score.math.score * perfectScore.math / value 
      newScore.tamgu1.score = tamgu1 * perfectScore.tamgu / value
      newScore.tamgu2.score = tamgu2 * perfectScore.tamgu / value 




    }

    else if ( majorData.major.univName == "이화여대") {

      const englishScore = majorData.gradeToScore.english.score[score.english.grade-1]


      const highestKorean = highestScore["국어"]
      const highestMath = highestScore[`수학${math_type}`]

      const highestTamgu1 = tamgu1TransitionScore.score.value[0]
      const highestTamgu2 = tamgu2TransitionScore.score.value[0]

      const tamgu1 = tamgu1TransitionScore.score.value[100-score.tamgu1.percentile]
      const tamgu2 = tamgu2TransitionScore.score.value[100-score.tamgu2.percentile]
      

      const value = ( highestKorean * 0.3 ) + ( highestTamgu1 + highestTamgu2 + highestMath ) * 0.25

      newScore.korean = score.korean.score * perfectScore.korean / value * 0.8
      newScore.english = englishScore * perfectScore.english / 100
      newScore.math = score.math.score * perfectScore.math / value * 0.8
      newScore.tamgu1.score = tamgu1 * perfectScore.tamgu / value * 0.8
      newScore.tamgu2.score = tamgu2 * perfectScore.tamgu / value * 0.8
      if ( majorData.metadata.tamguReplace == "사과 1과목 대체 가능" && score.foreign.score != null ) newScore.foreign.score = foreignTransitionScore.score.value[100-score.foreign.percentile] * perfectScore.tamgu / value * 0.8

    }

    // else if ( majorData.major.univName.indexOf("전남대") >= 0 && specialOption == "영역별 점수: 국(320) / 수(240) / 탐(240)"){


    // }
    
    else if ( applicationIndicatorType == "A") {

      var korean = score.korean.percentile
      var math = score.math.percentile
      var tamgu1 = score.tamgu1.percentile
      var tamgu2 = score.tamgu2.percentile
      var maxTamgu = Math.max(tamgu1,tamgu2)

      newScore.korean = (score.korean.percentile * perfectScore.korean ) / 100 
      newScore.math = ( score.math.percentile * perfectScore.math ) / 100 
      newScore.tamgu1.score = ( score.tamgu1.percentile * perfectScore.tamgu) / 100
      newScore.tamgu2.score = ( score.tamgu2.percentile * perfectScore.tamgu) / 100  
      newScore.foreign.score = (score.foreign.percentile * perfectScore.tamgu) / 100 


      // 창신대 , 창원대 예외처리 
      if ( specialOption == "( 국 백분위 x 0.72 + 108 ) + ( 수 백분위 x 0.48 + 72 ) + ( 탐 1과목 백분위 x 0.48 + 72 ) + 영 + 한") {
        newScore.korean = korean * 0.72 + 108
        newScore.math = math * 0.48 + 72
        newScore.tamgu1.score = tamgu1 * 0.48 + 72
        newScore.tamgu2.score = tamgu2 * 0.48 + 72
      }
      else if ( specialOption == "( 국 백분위 x 0.6 + 90 ) + ( 수 백분위 x 0.4 + 60 ) + ( 탐 1과목 백분위 x 0.4 + 60 ) + 영 + 한") {
        newScore.korean = korean * 0.6 + 90
        newScore.math = math * 0.4 + 60
        newScore.tamgu1.score = tamgu1 * 0.4 + 60
        newScore.tamgu2.score = tamgu2 * 0.4 + 60
      }

      else if ( specialOption == "( 국 백분위 x 0.84 + 126 ) + ( 수 백분위 x 0.56 + 84 ) + ( 탐구 백분위 평균 x 0.7 + 105 ) + 영") {
        newScore.korean = korean * 0.84 + 126
        newScore.math = math * 0.56 + 84
        newScore.tamgu1.score = tamgu1 * 0.7 + 105
        newScore.tamgu2.score = tamgu2 * 0.7 + 105
      }

      else if ( specialOption == "( 국 백분위 x 0.56 + 84 ) + ( 수 백분위 x 0.84 + 126 ) + ( 탐구 백분위 평균 x 0.7 + 105 ) + 영") {
        newScore.korean = korean * 0.56 + 84
        newScore.math = math * 0.84 + 126
        newScore.tamgu1.score = tamgu1 * 0.7 + 105
        newScore.tamgu2.score = tamgu2 * 0.7 + 105
      }

      else if  ( specialOption == "( 국 백분위 x 0.7 + 105 ) + ( 수 백분위 x 0.7 + 105 ) + ( 탐구 백분위 평균 x 0.7 + 105 ) + 영") {
        newScore.korean = korean * 0.7 + 105
        newScore.math = math * 0.7 + 105
        newScore.tamgu1.score = tamgu1 * 0.7 + 105
        newScore.tamgu2.score = tamgu2 * 0.7 + 105
      }

      else if ( specialOption == "( 국 백분위 x 0.84 + 126 ) + ( 수 백분위 x 0.7 + 105 ) + ( 탐구 백분위 평균 x 0.42 + 63 ) + 영") {
        newScore.korean = korean * 0.84 + 126
        newScore.math = math * 0.7 + 105
        newScore.tamgu1.score = tamgu1 * 0.42 + 63
        newScore.tamgu2.score = tamgu2 * 0.42 + 63
      }
    }
    // 표준점수 x (총점에 따른 비율) [ 국, 수, 탐 ] + 영 + 한
    else if ( applicationIndicatorType == "B") {

      console.log("B다임마")
      newScore.korean = score.korean.score * ( perfectScore.korean  ) / 100
      newScore.math = score.math.score * ( perfectScore.math  ) / 100

      newScore.tamgu1.score = score.tamgu1.score  * ( perfectScore.tamgu) / 100
      newScore.tamgu2.score = score.tamgu2.score * ( perfectScore.tamgu) / 100
      newScore.foreign.score = score.foreign.score * (perfectScore.foreign) / 100 
  
      if ( tamguReplace.length > 0 && score.foreign.score != null)  newScore.foreign.score = score.foreign.score * ( perfectScore.tamgu ) / 100

      if ( tamguTranslation.indexOf("탐구 변표사용") >= 0) { 

        newScore.tamgu1.score = tamgu1TransitionScore.score.value[100-score.tamgu1.percentile] * perfectScore.tamgu / 100
        console.log(newScore.tamgu1.score)
        newScore.tamgu2.score = tamgu2TransitionScore.score.value[100-score.tamgu2.percentile] * perfectScore.tamgu / 100 
        console.log(newScore.tamgu2.score)
        if ( tamguReplace.length > 0 && score.foreign.score != null) newScore.foreign.score = foreignTransitionScore.score.value[100-score.foreign.percentile] * perfectScore.tamgu / 100 
      }

      // 대구가톨릭의예 예외처리
      if ( tamguTranslation == "탐구: D타입") {

        var highest_tamgu_type = ""
        if ( tamgu_type == "자연") highest_tamgu_type = "과학탐구"
        else highest_tamgu_type = "사회탐구"

        var highestTamgu1 = highestScore[`${score.tamgu1.name}`]
        var highestTamgu2 = highestScore[`${score.tamgu2.name}`]

        newScore.tamgu1.score = score.tamgu1.score * ( perfectScore.tamgu ) / highestTamgu1
        newScore.tamgu2.score = score.tamgu2.score * ( perfectScore.tamgu ) / highestTamgu2
        
      }
      
    }
    // ( 표준점수 / 200 ) x (총점에 따른 비율) [ 국, 수, 탐 ] + 영 + 한
    else if ( applicationIndicatorType == "C") {

      console.log( "C다 임마")
      newScore.korean = score.korean.score * ( perfectScore.korean ) / 200

      console.log("1")

      if ( ( calculationSpecial.indexOf("수가 지원시 변표사용") >= 0 || calculationSpecial.indexOf("수가 선택시 변표사용") >= 0) && score.math.type == "가") {
  
        newScore.math = mathTransitionScore.score.value[150-score.math.score] * perfectScore.math / 200 
        console.log("2")
      } else if ( ( calculationSpecial.indexOf("수나 지원시 변표사용") >=0 || calculationSpecial.indexOf("수나 선택시 변표사용") >= 0) && score.math.type == "니") {
        newScore.math = mathTransitionScore.score.value[150-score.math.score] * perfectScore.math / 200 
        console.log("3")
      } 
      else newScore.math = score.math.score * ( perfectScore.math  ) / 200

      
      console.log("5")

      if ( tamguTranslation.indexOf("탐구 변표사용") >= 0) { 

        newScore.tamgu1.score = tamgu1TransitionScore.score.value[100-score.tamgu1.percentile] * perfectScore.tamgu / 100
        console.log(newScore.tamgu1.score)
        newScore.tamgu2.score = tamgu2TransitionScore.score.value[100-score.tamgu2.percentile] * perfectScore.tamgu / 100 
        console.log(newScore.tamgu2.score)

        if ( tamguReplace.length > 0 && score.foreign.score != null) newScore.foreign.score = foreignTransitionScore.score.value[100-score.foreign.percentile] * perfectScore.tamgu / 100 
 
      }
      else {

        newScore.tamgu1.score = score.tamgu1.score * (perfectScore.tamgu) / 100
        newScore.tamgu2.score = score.tamgu2.score * (perfectScore.tamgu) / 100
        newScore.foreign.score = score.foreign.score * ( perfectScore.tamgu) / 100 
      }

      // 경희대 국제 예외처리
      if ( specialOption == "탐구 본교 백분위변환표준점수+100 한 후 계산") {

        newScore.tamgu1.score = ( tamgu1TransitionScore.score.value[100-score.tamgu1.percentile] + 100) * perfectScore.tamgu / 200
        console.log(newScore.tamgu1.score)
        newScore.tamgu2.score = ( tamgu2TransitionScore.score.value[100-score.tamgu2.percentile] + 100) * perfectScore.tamgu / 200
        console.log(newScore.tamgu1.score)
        if ( tamguReplace.length > 0 && score.foreign.score != null) newScore.foreign.score = ( foreignTransitionScore.score.value[100-score.foreign.percentile] + 100) * perfectScore.tamgu / 200
      }

      //가톨릭대 예외처리
      if ( specialOption == "탐구:  탐구 상위 1과목 변표 그대로   ") {
        newScore.tamgu1.score = tamgu1TransitionScore.score.value[100-score.tamgu1.percentile]
        console.log(newScore.tamgu1.score)
        newScore.tamgu2.score = tamgu2TransitionScore.score.value[100-score.tamgu2.percentile]
        console.log(newScore.tamgu1.score)
      }

    }

    // ( 표준점수 / 과목 별 표준점수 최고점 ) x (총점에 따른 비율) [ 국, 수, 탐 ] + 영 + 한
    else if ( applicationIndicatorType == "D") {

      const highestKorean = highestScore["국어"]
      const highestMath = highestScore[`수학${math_type}`]

      var tempTamgu1 = score.tamgu1.score
      var tempTamgu2 = score.tamgu2.score
      var tempForeign = score.foreign.score

      if ( tamguTranslation.indexOf("탐구 변표사용") >= 0 ) {

        tempTamgu1 = tamgu1TransitionScore.score.value[100-score.tamgu1.percentile]
        tempTamgu2 = tamgu2TransitionScore.score.value[100-score.tamgu2.percentile]
        if ( tamguReplace.length > 0 && score.foreign.score != null) tempForeign = foreignTransitionScore.score.value[100-score.foreign.percentile]
      }

      var highest_tamgu_type = ""
      if ( tamgu_type == "자연") highest_tamgu_type = "과학탐구"
      else highest_tamgu_type = "사회탐구"


      var highestTamgu1 = highestScore[`${score.tamgu1.name}`]
      var highestTamgu2 = highestScore[`${score.tamgu2.name}`]

      var highestForeign = null

      if ( score.foreign.score != null) highestForeign = highestScore[`${score.foreign.name}`]

      // GIST , 서울시립대 , 한국외대 , 한양대 예외처리 
      if ( specialOption == "( 탐구 변표 / 변표 최고점 ) X 비율") {


        highestTamgu1 = tamgu1TransitionScore.score.value[0]
        highestTamgu2 = tamgu2TransitionScore.score.value[0]
        
        if ( tamguReplace.length > 0 && score.foreign.score != null) highestForeign = foreignTransitionScore.score.value[0]
      }


      
      newScore.korean = score.korean.score * ( perfectScore.korean ) / highestKorean
      newScore.math = score.math.score * (perfectScore.math ) / highestMath
      newScore.tamgu1.score = tempTamgu1 * ( perfectScore.tamgu ) / highestTamgu1
      newScore.tamgu2.score = tempTamgu2 * ( perfectScore.tamgu ) / highestTamgu2
  
      if ( score.foreign.score != null) newScore.foreign.score = tempForeign * ( perfectScore.tamgu ) / highestForeign


      
      if ( ( (calculationSpecial == "수가 지원시 변표사용" || calculationSpecial == "수가 선택시 변표사용" ) && score.math.type =="가") || (( calculationSpecial == "수나 지원시 변표사용" ||calculationSpecial =="수나 선택시 변표사용") && score.math.type =="나")) {
        newScore.math = mathTransitionScore.score.value[150-score.math.score] * perfectScore.math / highestMath 
      } else newScore.math = score.math.score * ( perfectScore.math  ) / highestMath


    
      // 단국데 의치 예외처리
      if ( specialOption == "백분위 x 비율 ( 탐 )") {
        newScore.tamgu1.score = ( score.tamgu1.percentile * perfectScore.tamgu) / 100
        newScore.tamgu2.score = ( score.tamgu2.percentile * perfectScore.tamgu) / 100 
      }

      // 전주교대 에외처리

      if ( calculationSpecial == "국: D타입 / 수,탐: A 타입 ") {

        newScore.math = ( score.math.percentile * perfectScore.math ) / 100 
        newScore.tamgu1.score = ( score.tamgu1.percentile * perfectScore.tamgu) / 100
        newScore.tamgu2.score = ( score.tamgu2.percentile * perfectScore.tamgu) / 100  
      }



    
    }

    // ( 표준점수 / 160 ) x (총점에 따른 비율) [ 국, 수, 탐 ] + 영 + 한
    else if ( applicationIndicatorType == "E") {

      newScore.korean = score.korean.score * ( perfectScore.korean ) / 160
      newScore.math = score.math.score * ( perfectScore.math  ) / 160

      newScore.tamgu1.score = score.tamgu1.score * perfectScore.tamgu / 160
      newScore.tamgu2.score = score.tamgu2.score * perfectScore.tamgu / 160
      newScore.foreign.score = score.foreign.score * perfectScore.tamgu / 160 


      if ( tamguTranslation.indexOf("탐구 변표사용") >= 0 ) {
        newScore.tamgu1.score = tamgu1TransitionScore.score.value[100-score.tamgu1.percentile] / 160
        newScore.tamgu2.score = tamgu2TransitionScore.score.value[100-score.tamgu2.percentile] / 160
        if ( tamguReplace.length > 0 && score.foreign.score != null) newScore.foreign.score = foreignTransitionScore.score.value[100-score.foreign.percentile] / 160

      }

      if ( calculationSpecial == "수가 지원시 변표사용" || calculationSpecial == "수나 지원시 변표사용" || calculationSpecial == "수가 선택시 변표사용" || calculationSpecial == "수가 지원시 변표사용") {
        newScore.math = mathTransitionScore.score.value[150-score.math.score] * perfectScore.math / 160 
      }

      // 서울교대 예외처리 
      if ( applicationIndicator == "( 표준점수/160 ) x 266.7") {

        newScore.korean = score.korean.score * 266.7 / 160
        newScore.math = score.math.score * 266.7 / 160
        newScore.tamgu1.score = score.tamgu1.score * 266.7 / 160 * 2
        newScore.tamgu2.score = score.tamgu2.score * 266.7 / 160 * 2
      }

    }
    
    // 표준점수의 합
    else if ( applicationIndicatorType == "F") {

      newScore.korean = score.korean.score
      newScore.math = score.math.score
      newScore.tamgu1.score = score.tamgu1.score 
      newScore.tamgu2.score = score.tamgu2.score
      newScore.foreign.score = score.foreign.score   

      

      if ( tamguTranslation.indexOf("탐구 변표사용") >= 0 ) {
        newScore.tamgu1.score = tamgu1TransitionScore.score.value[100-score.tamgu1.percentile]
        newScore.tamgu2.score = tamgu2TransitionScore.score.value[100-score.tamgu2.percentile]
        if ( tamguReplace.length > 0 && score.foreign.score != null) newScore.foreign.score = foreignTransitionScore.score.value[100-score.foreign.percentile]

      }


      if ( calculationSpecial == "수가 지원시 변표사용" || calculationSpecial == "수나 지원시 변표사용" || calculationSpecial == "수가 선택시 변표사용" || calculationSpecial == "수가 지원시 변표사용") {
        newScore.math = mathTransitionScore.score.value[150-score.math.score] * perfectScore.math / 160 
      }
    }
    
    // 등급: 4과목 평균 등급 환산점수
    else if ( applicationIndicatorType == "G") {

      if ( majorData.major.univName.indexOf("경동대") >= 0) {
        const gyungDongScore = await reportController.getScoreByGrade(score, majorData)
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


      else if ( majorData.gradeToScore.english.way == "수능비율포함" && applicationIndicatorType != "K") {
        newScore.english = majorData.gradeToScore.english.score[score.english.grade-1] * emv
      }

      else {
      
        if ( applicationIndicatorType != "K")
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



  


    if ( english_type == "가산"|| english_type == "감산" || majorData.gradeToScore.english.way == "감점" || majorData.gradeToScore.english.wah =="가산점") {
      extraScore.english = majorData.gradeToScore.english.score[score.english.grade-1] * emv
    }

    if ( history_type == "가산" || history_type =="감산" || majorData.gradeToScore.history.way =="감점" || majorData.gradeToScore.history.way == "가산점") {
      extraScore.history = majorData.gradeToScore.history.score[score.history.grade-1] * hmv 
    }

    var extra1 = 0
    var extra2 = 0
    var extra3 = 0 


    if ( ( extraValue.length > 0 ) && extraValue.indexOf(" // ") >= 0 ) {
      extra1 = parseInt(extraValue.split(" // ")[0])
      extra2 = parseInt(extraValue.split(" // ")[1])
      extra3 = parseInt(extraValue.split(" // ")[2])
    }


    

    if ( extraType == "% 가산") {

      if ( extraPoint == "중국어 표준점수 5% 총점에 가산" && score.foreign.name =="중국어") {
        extraScore.foreign = score.foreign.score * 0.05
      }
      else if( extraPoint == "일본어 표준점수 5% 총점에 가산" && score.foreign.name =="일본어") {
        extraScore.foreign = score.foreign.score * 0.05
      }
      else if ( extraPoint == "프랑스어 표준점수 5% 총점에 가산" && score.foreign.name =="프랑스어") {
        extraScore.foreign = score.foreign.score * 0.05
      }
      else if ( extraPoint == "독일어 표준점수 5% 총점에 가산" && score.foreign.name == "독일어") {
        extraScore.foreign = score.foreign.score * 0.05
      }
      else if ( extraPoint == "러시아어 표준점수 5% 총점에 가산" && score.foreign.name =="러시아어") {
        extraScore.foreign = score.foreign.score * 0.05
      }
      else if ( extraPoint == "한문 표준점수 5% 총점에 가산" && score.foreign.name =="한문") {
        extraScore.foreign = score.foreign.score * 0.05
      }

      else if ( extraPoint == "수가 백분위 10% , 과탐 1과목 백분위 10% 총점에 가산") {
 
        if ( score.math.type =="가")extraScore.math = score.math.percentile * 0.1
        if ( score.line == "자연") {
          if ( newScore.tamgu1.score > newScore.tamgu2.score) {
            extraScore.tamgu1 = newScore.tamgu1.score * 0.1
          } else {
            extraScore.tamgu2 = newScore.tamgu2.score * 0.1
          }
        }
      }

      if ( extraSubject == "수가") {
        if ( score.math.type =="가") {

          if ( extraPoint == "수가 백분위 20% 총점에 가산") {
            extraScore.math = score.math.percentile * 0.2 
          } 
          else if ( extraPoint == "수가 표준점수 10% 총점에 가산") {
            extraScore.math = score.math.score * 0.1
          }
          else if ( extraPoint == "수가 백분위 10% 총점에 가산") {
            extraScore.math = score.math.percentile * 0.1 
          }
          else if ( extraPoint == "수가 백분위 20% 총점에 가산") {
            extraScore.math = score.math.percentile * 0.1
          }
 
    
          else {
            extraScore.math = ( newScore.math * extraValue ) / 100 
          }
         
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

      else if ( extraSubject == "물리학") {

        if ( score.tamgu1.name.indexOf("물리학") >= 0) extraScore.tamgu1 = (newScore.tamgu1.score * extraValue) / 100
        if ( score.tamgu2.name.indexOf("물리학") >= 0) extraScore.tamgu2 = (newScore.tamgu2.score * extraValue) / 100 

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
      

        if ( extraPoint == "수가 백분위 20% , 과탐 백분위 10 %총점에 가산") {
          if ( score.math.type == "가") extraScore.math = score.math.percentile * 0.2
          if ( score.line == "자연") {
            extraScore.tamgu1 = score.tamgu1.percentile * 0.1
            extraScore.tamgu2 = score.tamgu2.percentile * 0.1
          }
        }
        else if ( extraPoint == "수가 표준점수 15% , 과탐 표준점수 6% 총점에 가산") {
          if ( score.math.type == "가") extraScore.math = score.math.score * 0.15
          if ( score.line == "자연") {
            extraScore.tamgu1 = score.tamgu1.score * 0.06
            extraScore.tamgu2 = score.tamgu2.score * 0.06
          }

        }
        else if ( extraPoint == "수가 표준점수 20% , 과탐 표준점수 6% 총점에 가산") {

          if (score.math.type == "가") extraScore.math = score.math.score * 0.2
          if ( score.line =="자연") {
            extraScore.tamgu1 = score.tamgu1.score * 0.06
            extraScore.tamgu2 = score.tamgu2.score * 0.06
          }

        }


      else if ( extraPoint == "수가 표준점수 10% , 과탐 백분위 5% 총점에 가산"){
        if ( score.math.type == "가") extraScore.math = score.math.score * 0.1
        if ( score.line =="자연") {
          extraScore.tamgu1 = score.tamgu1.percentile * 0.05
          extraScore.tamgu2 = score.tamgu2.percentile * 0.05
        }
      }
        else { 

          if ( score.math.type == "가") extraScore.math = ( newScore.math * extra1) / 100 

          if ( score.line == "자연") {
            extraScore.tamgu1 = ( newScore.tamgu1.score * extra2 ) / 100
            extraScore.tamgu2 = ( newScore.tamgu2.score * extra2 ) / 100 
          }
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

      else if ( extraSubject == "수가 / 과I / 과Ⅱ" || extraSubject == "수가 / 과탐I / 과탐Ⅱ") {

        if ( score.math.type =="가") extraScore.math = newScore.math * extra1 / 100

        if ( score.line == "자연") {
          if ( score.tamgu1.name.indexOf("1") >= 0) {
            extraScore.tamgu1 = newScore.tamgu1.score * extra2 / 100
            
          }
          else extraScore.tamgu1 = newScore.tamgu1.score * extra3 / 100

          if ( score.tamgu2.name.indexOf("2" >= 0) ){
            extraScore.tamgu2 = newScore.tamgu2.score * extra2 / 100
          }
          else {
            extraScore.tamgu2 = newScore.tamgu2.score * extra3 / 100
          }
        }

      }

      else if ( extraSubject == "영어 1등급 / 2등급") {

        if ( score.english.grade == 1) {
          extraScore.english = ( newScore.english * extra1 ) / 100
        }
        else if ( score.english.grade == 2 ) {
          extraScore.english = ( newScore.english * extra2 ) / 100 
        }


      }


      if ( majorData.major.univName == "부산대") {
        if ( extraSubject == score.foreign.name ) {
          extraScore.foreign = score.foreign.score * 0.05
        }
      }

      if ( extraSubject == "1등급 / 2등급"){
        if ( score.korean.grade == 1) {
          extraScore.korean = newScore.korean * extra1 / 100
        }

        else if ( score.korean.grade == 2) {
          extraScore.korean = newScore.korean * extra2 / 100
        }

        if (score.math.grade == 1){
          extraScore.math = newScore.math * extra1 / 100
        }
        else if (score.math.grade == 2 ) {
          extraScore.math = newScore.math * extra2 / 100
        }

        if ( score.tamgu1.grade ==1 ) {
          extraScore.tamgu1 = newScore.tamgu1.score * extra1 / 100
        }
        else if ( score.tamgu1.grade ==1 ) {
          extraScore.tamgu1 = newScore.tamgu1.score * extra2 / 100
        }

        if ( score.tamgu2.grade == 1) {
          extraScore.tamgu2 = newScore.tamgu2.score * extra1 / 100
        } else if ( score.tamgu2.grade ==2) {
          extraScore.tamgu2 = newScore.tamgu2.score * extra2 / 100
        }

        if ( score.english.grade ==1 ) {
          extraScore.english = newScore.english * extra1 / 100
        }

        else if ( score.english.grade == 2 )  {
          extraScore.english = newScore.english * extra2 / 100
        }

        if ( score.foreign.grade == 1 ) {
          extraScore.foreign = newScore.foreign.score * extra1 / 100
        }
        else if ( score.foreign.grade ==2 ) {
          extraScore.foreign = newScore.foreign.score * extra1 /100
        }

        if ( score.history.grade == 1 ) {
          extraScore.history = newScore.history * extra1 / 100
        }

        else if ( score.history.grade == 2 ) {
          extraScore.history = newScore.history * extra2 / 100
        }
      }
    }

    else if ( extraType == "% 감산") {
      
      if ( extraSubject == "수나" && score.math.type == "나") {
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
  
    
    else {

      if ( extraPoint == "+ [ 수가 ( 개인 취득 표준점수 / 전국최고 표준점수 ) x 10 ]" && score.math.type =="가") {

        const highestMath = highestScore["수학가"]

        extraScore.math = score.math.score / highestMath * 10
      }

      else if ( extraPoint == "수가 백분위 10%, 물리학Ⅱ, 화학Ⅱ, 생명과학Ⅱ 중 최상위 한 과목 백분위 5% 총점에 가산") {
        const tamgu1Name = score.tamgu1.name
        const tamgu2Name = score.tamgu2.name
        
        var tamgu1Score = 0
        var tamgu2Score = 0

        if ( score.math.type == "가") {
          extraScore.math = newScore.math * 0.1
        }

        if ( score.line == "자연") {
          if ( tamgu1Name == "물리학2" || tamgu1Name == "화학2" || tamgu1Name == "생명과학2") {

            tamgu1Score = score.tamgu1.percentile
          }
          
          if ( tamgu2Name == "물리학2" || tamgu2Name == "화학2" || tamgu2Name == "생명과학2") {

            tamgu2Score = score.tamgu2.percentile
          }

          extraScore.tamgu = Math.max(tamgu1Score,tamgu2Score) * 0.05
        }
      }

      else if ( extraPoint == "수가 10% / 과탐(상위 3개영역에 포함될 경우) 10점 가산" && score.math.type =="가" && score.line == "자연") {

        extraScore.math = newScore.math * 0.1  
      }

      else if ( extraPoint == "수가 백분위 10%, 물Ⅱ, 화Ⅱ, 생Ⅱ 중 최상위 한 과목 백분위 5% 총점에 가산" ) {

        const tamgu1Name = score.tamgu1.name
        const tamgu2Name = score.tamgu2.name
        
        var tamgu1Score = 0
        var tamgu2Score = 0

        if ( score.math.type == "가") {
          extraScore.math = newScore.math * 0.1
        }

        if ( score.line == "자연") {
          if ( tamgu1Name == "물리학2" || tamgu1Name == "화학2" || tamgu1Name == "생명과학2") {

            tamgu1Score = score.tamgu1.percentile
          }
          
          if ( tamgu2Name == "물리학2" || tamgu2Name == "화학2" || tamgu2Name == "생명과학2") {

            tamgu2Score = score.tamgu2.percentile
          }

          extraScore.tamgu = Math.max(tamgu1Score,tamgu2Score) * 0.05
        }
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

        if ( score.tamgu1.name == "물리학2" || score.tamgu1.name == "화학2" || score.tamgu1.name =="생명과학2") {


        }

        
      }


    }


    const totalScore = {
      korean : newScore.korean + extraScore.korean,
      math : newScore.math + extraScore.math,
      english : newScore.english + extraScore.english,
      tamgu : 0,
      history : newScore.history + extraScore.history,
      foreign : newScore.foreign.score + extraScore.foreign
    }

    /**
     * 탐구 반영 갯수에 따라서 달라진다
     */
    var tamguList = []

    var tamgu1 = newScore.tamgu1.score + extraScore.tamgu1
    var tamgu2 = newScore.tamgu2.score + extraScore.tamgu2
    var foreign = totalScore.foreign

    if ( tamguReplace == "사과 1과목 대체 가능" && score.foreign.name != null ) {
      tamguList = [tamgu1, tamgu2, foreign]
    }
    else if ( tamguReplace == "과 1과목 대체 가능" && score.line =="자연" && score.foreign.name != null) {
      tamguList = [tamgu1, tamgu2, foreign]
    }
    else if ( tamguReplace == "사 1과목 대체 가능" && score.line =="인문" && score.foreign.name != null){
      tamguList = [tamgu1,tamgu2, foreign]
    }
    else if ( tamguReplace == "사과 1과목 프랑스어/독일어 대체 가능"  && ( score.foreign.name == "프랑스어" || score.foreign.name == "독일어")) {
      tamguList = [tamgu1,tamgu2, foreign]
    }
    else if ( tamguReplace == "사 1과목 프랑스어 대체 가능" && score.foreign.name =="프랑스어") {
      tamguList = [tamgu1,tamgu2,foreign]
    }
    else if ( tamguReplace == "사과 1과목 일본어 대체 가능" && ( score.foreign.name =="일본어")) {
      tamguList = [tamgu1,tamgu2,foreign]
    }
    else if ( tamguReplace == "사과 1과목 한문/중국어 대체 가능" && (score.foreign.name =="한문" || score.foreign.name =="중국어")){
      tamguList = [tamgu1, tamgu2, foreign]
    }
    else tamguList = [tamgu1,tamgu2]

    tamguList.sort(function(a, b) { 
      return b - a
    })

    if ( majorData.metadata.tamguNumber == 1 ) {

      totalScore.tamgu = tamguList[0]
    }
    
    else if ( majorData.metadata.tamguNumber == 2 ) {

      totalScore.tamgu = ( tamguList[0] + tamguList[1] ) / 2

      if ( applicationIndicatorType == "F") totalScore.tamgu *= 2

      // 인하대 예외처리

      if ( specialOption == "{ (탐구 변표 평균 +100) / (탐구변표최고점 +100) } X 비율") {

        const transitionHighestScore = tamgu1TransitionScore.score.value[0]

        if ( tamguReplace.length > 0 && score.foreign.score != null) highestForeign = foreignTransitionScore.score.value[0]

        newScore.tamgu1.score = tamgu1TransitionScore.score.value[100-score.tamgu1.percentile]
        newScore.tamgu2.score = tamgu2TransitionScore.score.value[100-score.tamgu2.percentile]

        if ( tamguReplace.length > 0 && score.foreign.score != null) newScore.foreign = foreignTransitionScore.score.value[100-score.foreign.percentile]

        totalScore.tamgu = (( newScore.tamgu1.score + newScore.tamgu2.score ) / 2 + 100 ) / ( transitionHighestScore + 100 ) * perfectScore.tamgu

      }
    }

    if ( majorData.major.univName == "고려대(세종)" ) {
      totalScore.tamgu = newScore.tamgu1.score + newScore.tamgu2.score
    }

    if ( majorData.major.univName =="이화여대") {
      const scoreList = [newScore.tamgu1.score, newScore.tamgu2.score, newScore.foreign.score]

      scoreList.sort(function(a, b) { 
        return b - a
      })

      totalScore.tamgu = scoreList[0] + scoreList[1]
  
    }

  

    // 울산대 예외
    if ( specialOption == "국,수,탐 각각  x 0.918") {

      totalScore.korean *= 0.918
      totalScore.math *= 0.918
      totalScore.tamgu *= 0.918
    }

    else if ( specialOption == "국,수,탐 각각  x 0.944") {

      totalScore.korean *= 0.944
      totalScore.math *= 0.944
      totalScore.tamgu *= 0.944
    }

    // 홍익대 예외 

    if ( majorData.major.univName.indexOf("홍익대") >= 0) {


      newScore.korean = score.korean.score * major_ratio.korean / 100
      newScore.english = majorData.gradeToScore.english.score[score.english.grade-1] * major_ratio.english / 100
      newScore.tamgu1.score = score.tamgu1.score * major_ratio.tamgu.science / 100
      newScore.tamgu2.score = score.tamgu2.score * major_ratio.tamgu.science / 100
      newScore.math = score.math.score * major_ratio.math.ga / 100

      totalScore.korean = newScore.korean
      totalScore.math = newScore.math
      totalScore.tamgu = ( newScore.tamgu1.score + newScore.tamgu2.score  ) 
      totalScore.english = newScore.english
    }
    

    

    /**
     * 반영비율별로 해서 구해보자!
     */
    const reflectionSubject = majorData.metadata.reflectionSubject

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
    else if ( reflectionSubject == "국+영") {
      totalSum = totalScore.korean + totalScore.english
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


      
      scoreList1.sort(function(a, b) { 
        return b - a
      })

      const scoreList2 = [scoreList1[1],scoreList1[2] , totalScore.tamgu]
      scoreList2.sort(function(a, b) { 
        return b - a
      })

      totalSum = scoreList1[0] + scoreList2[0]

    }
    else if ( reflectionSubject == "국,수,영,탐 중 택2"){


      const scoreList = [totalScore.korean , totalScore.math, totalScore.english , totalScore.tamgu]
      
      scoreList.sort(function(a, b) { 
        return b - a
      })
     
      totalSum = scoreList[0] + scoreList[1]

    }
    else if ( reflectionSubject == "국,수,영,탐 중 택3") {

      const scoreList = [totalScore.korean, totalScore.english , totalScore.math, totalScore.tamgu]

      scoreList.sort(function(a, b) { 
        return b - a
      })

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

      scoreList.sort(function(a,b) {
        return b - a
      })
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

      if ( majorData.metadata.sooneungSpecial == "각 과목 별로 가산점 반영 시 과목 영역별 점수 초과 불가능 , 과목이 순위에 포함x 일 경우도 가산은 적용") {

        if ( totalScore.korean > perfectScore.korean) totalScore.korean = perfectScore.korean
        if ( totalScore.english > perfectScore.english) totalScore.english = perfectScore.english
        if ( totalScore.math > perfectScore.math ) totalScore.math = perfectScore.math
        if ( totalScore.tamgu > perfectScore.tamgu ) totalScore.tamgu = perfectScore.tamgu
  
        totalSum = totalScore.korean + totalScore.english + totalScore.math + totalScore.tamgu 
      }
  

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

    else if ( reflectionSubject == "영+( 국,수,탐 중 택1 )") {

      const scoreList = [totalScore.korean , totalScore.math, totalScore.tamgu]

      scoreList.sort(function(a,b) {
        return b - a
      })

      totalSum = totalScore.english + scoreList[0]
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

    // 한성대 
    else if ( reflectionSubject == "( 국, 수가나 우수영역 순서대로 40% + 20% ) + 영 25% + 탐 15%") {

      const scoreList = [ totalScore.korean, totalScore.math]

      scoreList.sort(function(a, b) { 
        return b - a
      })

      if ( majorData.major.univName == "한성대" && score.math.type == "가") {
        if ( scoreList[0] == totalScore.korean ) scoreList[1] += 10
        else if ( scoreList[0] == totalScore.math ) scoreList[0] += 30
      }

      totalSum = scoreList[0] * 0.4 + scoreList[1] * 0.2 + totalScore.english * 0.25 + totalScore.tamgu * 0.15

    }

    else if ( reflectionSubject == "우수영역 순서대로 45% + 40% + 15%") {

      const scoreList = [totalScore.korean, totalScore.english, totalScore.math , totalScore.tamgu, totalScore.history]

      scoreList.sort(function(a, b) { 
        return b - a
      })

      totalSum = scoreList[0] * 0.45 + scoreList[1] * 0.4 + scoreList[2] * 0.15


    }

    else {
      console.log("에러야 에러 순서에서 에러")
      totalSum = -1
    }


    // 마지막으로 totalSum을 조정해보장
    if ( majorData.gradeToScore.history.way == "가산점") {
      totalSum += totalScore.history
    }

    if ( majorData.gradeToScore.english.way == "가산점") {
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

    if ( isNaN(basicScore) == false ) {
      totalSum += basicScore

    }


    var naesinScore = 0.0

    // if ( score.naesinScore !== 0 &&  isNaN(majorData.metadata.naesinRatio) == false ) {

    //   const naesin = await naesinService.findOne(
    //     majorData.major.univName,
    //     majorData.major.recruitmentType,
    //     majorData.major.recruitmentUnit,
    //     majorData.major.sosokUniversity,
    //     majorData.major.majorName,
    //     score.naesinType,
    //     score.naesinScore
    //   )

    //   if ( score.naesinType === "검정고시") {

    //     if ( majorData.major.univName === "한양대") naesinScore = 98.5
    //     else if ( majorData.major.univName === "부산교대"){
    //       const korean = score.korean.percentile
    //       const math = score.math.percentile
    //       const english = majorData.gradeToScore.english.score[score.english.grade-1]
    //       const tamgu = ( score.tamgu1.percentile + score.tamgu2.percentile) / 2

    //       naesinScore = ( korean + math + english + tamgu ) * 1.25
    //     }
    //     else if ( majorData.major.univName === "광주교대") {
    //       const history = majorData.gradeToScore.history.score[score.history.grade-1]

    //       naesinScore = ( parseFloat(totalSum) - history ) / 9
    //     }

    //   }

    //   if ( naesin !== null ) naesinScore = naesin.value
    // }

    // if ( isNaN(naesinScore) ) naesinScore = 0


    if ( create == true ) {

      const recommendations = await majorDataService.findRecommendations(totalSum)

      const modelObj = {
        score : newScore,
        majorDataId : majorData.id,
        userId : score.userId,
        perfectScore,
        extraScore : extraScore,
        totalScore : totalSum,
        recommendations,
        actualPerfectScore : major_perfectScore,
        naesinScore
      }
      
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

      const tamgu = Math.min(score.tamgu1.grade, score.tamgu2.grade)

      if ( score.korean.grade < 8 ) koreanScore = 350 - 35 * ( score.korean.grade -1 )
      else if ( score.korean.grade == 8 ) koreanScore = 80

      if (score.math.grade < 8 ) mathScore = 350 - 35 * ( score.math.grade - 1 )
      else if ( score.math.grade == 8 ) mathScore = 80

      const maxScore = Math.max(koreanScore,mathScore)

      if ( score.english.grade < 6 ) englishScore = 350 - 10 * ( score.english.grade - 1 )
      else if ( score.english.grade == 6 ) englishScore = 250
      else if ( score.english.grade == 7 ) englishScore = 230
      else if ( score.english.grade == 8 ) englishScore = 180

      if ( tamgu < 6 ) tamguScore = 300 - 10 * ( tamgu - 1 )
      else if ( tamgu == 6 ) tamguScore = 210
      else if ( tamgu == 7 ) tamguScore = 190
      else if ( tamgu == 8 ) tamguScore = 100

      var historyScore = 0 
      if ( score.history.grade < 6 ) historyScore = 300 - 10 * ( score.history.grade - 1 )
      else if ( score.history.grade == 6 ) historyScore = 210
      else if ( score.history.grade == 7 ) historyScore = 190
      else if ( score.history.grade == 8 ) historyScore = 100

      if ( historyScore > tamguScore ) tamguScore = historyScore


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

      const newAverageGrade = score.korean.grade * 0.4 + score.english.grade * 0.3 + tamgu * 0.3

      if ( majorData.major.line == "예체능") translationScore = 200 - Math.floor(newAverageGrade) * 10 
      else translationScore = 50 - 2.5 * Math.floor(newAverageGrade)



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
