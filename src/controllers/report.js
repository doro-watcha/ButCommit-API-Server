import { reportService , majorDataService, scoreService } from '../services'
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

      const response = {
        success : true,
        data : {
          report
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

    // ApplicationIndicator로 반영점수 구하기 ( ex: 백분위,표준점수 등등)

    // 과목별 변환 만점 구하기 ex) 700 ,1000
    const major_perfectScore = majorData.metadata.perfectScore

    const major_ratio = majorData.ratio

    const perfectScore = {
      korean : major_perfectScore * ( major_ratio.korean / 100 ),
      english : major_perfectScore * ( major_ratio.english / 100 ),
      math : 0,
      tamgu : 0,
      history : major_perfectScore * ( major_ratio.history / 100 )
    }
    const math_type = score.math.type
    const tamgu_type = score.line

    if ( math_type == "가") {
      perfectScore.math = major_perfectScore * ( major_ratio.math.ga / 100 )
    } else if ( math_type == "나") {
      perfectScore.math = major_perfectScore * (major_ratio.math.na / 100 )
    }

    if ( tamgu_type == "인문"){
      perfectScore.tamgu = major_perfectScore * ( major_ratio.tamgu.science / 100)
    } else {
      perfectScore.tamgu = major_perfectScore * ( major_ratio.tamgu.society / 100)
    }


    // 반영 방법에 따라서 반영 비율 구하기 

    const ratio = majorData.ratio

    const reflectionSubject = majorData.metadata.reflectionSubject

    const newRatio = {
      korean : ratio.korean , math : 0 , englsih : ratio.english, tamgu : 0, history : ratio.history
    }

    // 수학 과목별로 비율 구하기 
    if ( score.math.type == "가") {
      newRatio.math = ratio.math.ga
    }
    else if ( score.math.type == "나"){
      newRatio.math = ratio.math.na
    }

    // 과학 과목별로 비율 구하기
    if ( score.line == "인문"){
      newRatio.tamgu = ratio.tamgu.society
    }
    else {
      newRatio.tamgu = ratio.tamgu.science 
    }
    


    // 실제로 점수 변환 점수 계산하기

    const applicationIndicator = majorData.metadata.applicationIndicator
    const newScore = {
      korean : 0 , english : 0, tamgu : 0 , math : 0 , history : 0 
    }

    
    if ( applicationIndicator == "표준점수") {

      newScore.korean = (score.korean.score * perfectScore.korean ) / 200 
      newScore.math = ( score.math.score * perfectScore.math ) / 200 
      newScore.tamgu = ( ( score.tamgu1.score + score.tamgu2.score ) * perfectScore.tamgu ) / 200
      newScore.english = majorData.gradeToScore.english.score[score.english.grade-1] * perfectScore.english / 200
      newScore.history = majorData.gradeToScore.history.score[score.history.grade-1] * perfectScore.history / 200
      
    }
    else if ( applicationIndicator == "표+백") {

      newScore.korean = score.korean.score * ( perfectScore.korean / 200 )
      newScore.math = score.math.score * ( perfectScore.math / 200 )
      newScore.tamgu = ( score.tamgu1.grade + score.tamgu2.grade ) * ( perfectScore.tamgu / 200 )
      newScore.english = majorData.gradeToScore.english.score[score.english.grade-1] * perfectScore.english / 200
      newScore.history = majorData.gradeToScore.history.score[score.history.grade-1] * perfectScore.history / 200

    }
    else if ( applicationIndicator == "백분위") {

      newScore.korean = (score.korean.percentile * perfectScore.korean ) / 100 
      newScore.math = ( score.math.percentile * perfectScore.math ) / 100 
      newScore.tamgu = ( ( ( score.tamgu1.percentile + score.tamgu2.percentile ) / 2 ) * perfectScore.tamgu ) / 100
      newScore.english = majorData.gradeToScore.english.score[score.english.grade-1] * perfectScore.english / 100
      newScore.history = majorData.gradeToScore.history.score[score.history.grade-1] * perfectScore.history / 100
    }


    // 변환 가산점 구하기 

    const extra = majorData.metadata.extraPoint

    const extraScore = {
      korean : 0,
      english : 0,
      math : 0,
      tamgu : 0,
      history : 0
    }


    if ( extra.indexOf("수가") >= 0  && math_type == "가") {

      if ( extra.indexOf("%") >= 0) {
        const number = extra.replace(/[^0-9]/g,'')
        extraScore.math = newScore.math * number / 100 
    
      } 

    }
    
    if ( extra.indexOf("수나") >= 0 && extra.indexOf("%") >= 0 && math_type == "나") {
      const number = extra.replace(/[^0-9]/g,'')
      extraScore.math = -newScore.math * number / 100 

    }

    if ( extra.indexOf("과탐") >= 0 && score.line == "자연") {

      if ( extra.indexOf("과탐Ⅱ") >= 0) {
      }
      
      if ( extra.indexOf("%") >= 0) {
        const number = extra.replace(/[^0-9]/g,'')
        extraScore.tamgu = newScore.tamgu * number / 100 

      }
    }
    
    const totalScore = {
      korean : newScore.korean + extraScore.korean,
      math : newScore.math + extraScore.math,
      english : newScore.english + extraScore.english,
      tamgu : newScore.tamgu + extraScore.tamgu,
      history : newScore.history + extraScore.history
    }



    // 반영 과목에 따라서 점수 재배치 

    if (reflectionSubject.indexOf("탐,한+국,수,영중 택2") >= 0 || reflectionSubject.indexOf("탐+국,수,영중 택2") >= 0) {
      var scores = [totalScore.korean, totalScore.math, totalScore.englsih]
      
      scores.sort(function(a,b){
        return b - a
      })
 
      if ( scores[2] == totalScore.korean) {
        newScore.koeran = 0
        extraScore.korean = 0
      }
      else if ( scores[2] == totalScore.english) {
        newScore.english = 0
        extraScore.english = 0
      } else {
        newScore.math = 0
        extraScore.math = 0
      }
    }
    else if ( reflectionSubject.indexOf("탐+국,수,영중 택1") >= 0 && reflectionSubject.indexOf("탐+수+국,영중 상위1개영역") >= 0) {

      var scores = [totalScore.korean, totalScore.math, totalScore.englsih]
      scores.sort(function(a,b){
        return b - a
      })
 
      if ( scores[0] == totalScore.korean) {
        newScore.math = 0
        newScore.english = 0
        extraScore.math = 0
        extraScore.english = 0
      }
      else if ( scores[0] == totalScore.english) {
        newScore.korean = 0
        newScore.math = 0
        extraScore.korean = 0
        extraScore.math = 0
      }
      else {
        newScore.korean = 0
        newScore.english = 0
        extraScore.korean = 0
        extraScore.english = 0
      }

    }

    else if ( reflectionSubject.indexOf("국,수,영,탐중 상위 3개 영역") >= 0 || reflectionSubject.indexOf("국,수,영,탐중 택3") >= 0 && reflectionSubject.indexOf("국,수,영,탐,제2외국어중 택3")){

      var scores = [totalScore.korean , totalScore.math, totalScore.english , totalScore.tamgu]
      scores.sort(function(a,b){
        return b - a
      })
 
      if ( scores[3] == newScore.korean) {
        newScore.korean = 0
        extraScore.korean = 0
      }
      else if ( scores[3] == newScore.english ) {
        newScore.english = 0
        extraScore.english = 0
      }
      else if ( scores[3] == newScore.math ){
        newScore.math = 0 
        extraScore.math = 0
      }
      else {
        newScore.tamgu = 0
        extraScore.tamgu = 0
      } 

    }
    else if ( reflectionSubject.indexOf("영+국,수,탐중 택2") >= 0) {
      var scores = [totalScore.korean , totalScore.math, totalScore.tamgu]
      scores.sort(function(a,b){
        return b - a
      })
 

      if ( scores[2] == newScore.korean) {
        newScore.korean = 0
        extraScore.korean = 0 
      }
      else if ( scores[2] == newScore.math) {
        newScore.math = 0
        extraScore.math = 0
      }
      else {
        newScore.tamgu = 0 
        extraScore.tamgu = 0
      }
    }

    else if ( reflectionSubject.indexOf("영,탐+국,수중 택1") >= 0 || reflectionSubject.indexOf("영+탐+국,수중 택1") >= 0) {
      if ( totalScore.korean < totalScore.math ) {
        newScore.korean = 0
        extraScore.korean = 0
      }
      else {
        newScore.math = 0
        extraScore.math = 0 
      }

    }
    else if ( reflectionSubject.indexOf("국,수,영,탐,한중 택4") >= 0) {
      var scores = [totalScore.korean, totalScore.math, totalScore.english , totalScore.tamgu, totalScore.history]
      scores.sort(function(a,b){
        return b - a
      })
 
      if ( scores[4] == totalScore.korean) {
        newScore.korean = 0
        extraScore.korean = 0
      }
      else if ( scores[4] == totalScore.english ) {
        newScore.english = 0
        extraScore.english = 0
      }
      else if ( scores[4] == totalScore.math ) {
        newScore.math = 0
        extraScore.math = 0
      }
      else if ( scores[4] == totalScore.tamgu ) {
        newScore.tamgu = 0
        extraScore.tamgu = 0  
      }
      else {
        newScore.history = 0 
        extraScore.history = 0
      }

    }
    else if ( reflectionSubject.indexOf("국,수,영,탐중 택2") >= 0 ){
      var scores = [totalScore.korean, totalScore.math, totalScore.english , totalScore.tamgu]
      scores.sort(function(a,b){
        return b - a
      })

      if ( scores[0] == totalScore.korean ) {
        if ( scores[1] == totalScore.math) {
          newScore.english = 0
          newScore.tamgu = 0

          extraScore.english = 0
          extraScore.tamgu = 0
        }
        else if ( scores[1] == totalScore.english) {

          newScore.math = 0
          newScore.tamgu = 0

          extraScore.math = 0
          extraScore.tamgu = 0
        }
        else {
          newScore.math = 0
          newScore.english = 0

          extraScore.math = 0
          extraScore.english = 0

        }

      }

      else if ( scores[0] == totalScore.math ) {

        if ( scores[1] == totalScore.korean) {
          newScore.english = 0
          newScore.tamgu = 0

          extraScore.english = 0
          extraScore.tamgu = 0

        }
        else if ( scores[1] == totalScore.english) {

          newScore.korean = 0
          newScore.tamgu = 0

          extraScore.korean = 0
          extraScore.tamgu = 0
        }
        else {

          newScore.korean = 0
          newScore.english = 0

          extraScore.korean = 0
          extraScore.english = 0

        }

      }

      else if ( scores[0] == totalScore.english ) {

        if ( scores[1] == totalScore.korean) {
          newScore.math = 0
          newScore.tamgu = 0

          extraScore.math = 0
          extraScore.tamgu = 0
        }
        else if ( scores[1] == totalScore.math) {
          newScore.korean = 0
          newScore.tamgu = 0

          extraScore.korean = 0
          extraScore.tamgu = 0
        }
    
        else {
          newScore.korean = 0
          newScore.math = 0

          extraScore.korean = 0
          extraScore.math = 0

        }
      }

      else {
        if ( scores[1] == totalScore.korean) {
          newScore.math = 0
          newScore.english = 0

          extraScore.math = 0
          extraScore.english = 0
        }
        else if ( scores[1] == totalScore.math) {

          newScore.korean = 0
          newScore.english = 0

          extraScore.korean = 0
          extraScore.english = 0
        }

        else {
          newScore.math = 0
          newScore.korean = 0

          extraScore.math = 0
          extraScore.korean = 0

        }
      }
      
 


    }
    else if ( reflectionSubject.indexOf("국,영+수,탐중 택1") >= 0 ) {
      if ( totalScore.math > totalScore.tamgu ) {
        newScore.tamgu = 0
        extraScore.tamgu = 0
      }
      else {
        newScore.math = 0
        extraScore.math = 0
      }
    }

    else if ( reflectionSubject.indexOf("수,탐+국,영중 택1") >= 0 ){
      if ( totalScore.korean > totalScore.english ) {
        newScore.english = 0
        extraScore.english = 0
      } else {
        newScore.korean = 0
        extraScore.korean = 0
      }
    }
    else if ( reflectionSubject.indexOf("영,한중 택1+국,수,탐중 택2") >= 0) {
      if ( totalScore.history > totalScore.english ) {
        newScore.english = 0
        extraScore.english = 0
      } else {
        newScore.history = 0
        extraScore.history = 0
      }

      var scores = [totalScore.korean , totalScore.math, totalScore.tamgu]
      scores.sort(function(a,b){
        return b - a
      })
 

      if ( scores[2] == newScore.korean) {
        newScore.korean = 0
        extraScore.korean = 0 
      }
      else if ( scores[2] == newScore.math) {
        newScore.math = 0
        extraScore.math = 0
      }
      else {
        newScore.tamgu = 0 
        extraScore.tamgu = 0
      }

    }
    else if ( reflectionSubject.indexOf("수,영+국,탐중 택1") >= 0 ) {

      if ( totalScore.korean > totalScore.tamgu ) {
        newScore.tamgu = 0
        extraScore.tamgu = 0

      }
      else {
        newScore.korean = 0
        extraScore.korean = 0
      }

    }
    else if ( reflectionSubject.indexOf("국+수,영,탐,한중 택1") >= 0 ) {

      var scores = [totalScore.math, totalScore.english , totalScore.tamgu, totalScore.history]
      scores.sort(function(a,b){
        return b - a
      })
 
      if ( scores[0] == totalScore.math) {
        newScore.english = 0
        newScore.tamgu = 0
        newScore.history = 0

        extraScore.english = 0
        extraScore.tamgu = 0
        extraScore.history = 0
      }

      else if ( scores[0] == totalScore.english) {

        newScore.korean = 0
        newScore.tamgu = 0
        newScore.history = 0

        extraScore.korean = 0
        extraScore.tamgu = 0
        extraScore.history = 0 
      }

      else if ( scores[0] == totalScore.tamgu ) {
        
        newScore.math = 0
        newScore.english = 0
        newScore.history = 0

        extraScore.math = 0
        extraScore.english = 0
        extraScore.history = 0


      } else {

        newScore.korean = 0
        newScore.math = 0
        newScore.english = 0

        extraScore.korean = 0
        extraScore.math = 0
        extraScore.english = 0 
      }
    }

    else if ( reflectionSubject.indexOf("수+국,영,탐중 택1") >= 0 ) {
      var scores = [totalScore.korean, totalScore.english , totalScore.tamgu]

      scores.sort(function(a,b){
        return b - a
      })
 

      if ( scores[0] == totalScore.korean ) {
        newScore.english = 0
        newScore.tamgu = 0 

        extraScore.english = 0
        extraScore.tamgu = 0

      }
      else if ( scores[0] == totalScore.english ) {
        newScore.korean = 0
        newScore.tamgu = 0

        extraScore.korean = 0
        extraScore.tamgu = 0
      }
      else if ( scores[0] == totalScore.tamgu ) {

        newScore.korean = 0
        newScore.english = 0

        extraScore.korean = 0
        extraScore.english = 0
      }
    }

    else if ( reflectionSubject.indexOf("수+국,영,탐,한중 택1") >= 0 ) {


      var scores = [totalScore.korean, totalScore.english , totalScore.tamgu , totalScore.history]

      scores.sort(function(a,b){
        return b - a
      })
 

      if ( scores[0] == totalScore.korean) {
        newScore.english = 0
        newScore.tamgu = 0
        newScore.history = 0

        extraScore.english = 0
        extraScore.tamgu = 0
        extraScore.history = 0
      }
      else if ( scores[0] == totalScore.english ) {

        newScore.korean = 0 
        newScore.tamgu = 0
        newScore.history = 0

        extraScore.korean = 0
        extraScore.tamgu = 0
        extraScore.history = 0
      }
      else if ( scores[0] == totalScore.tamgu) {

        newScore.korean = 0
        newScore.english = 0
        newScore.history = 0

        extraScore.korean = 0
        extraScore.english = 0
        extraScore.history = 0

      }
      else  {

        newScore.korean = 0
        newScore.english = 0
        newScore.tamgu = 0

        extraScore.korean = 0 
        extraScore.english = 0
        extraScore.tamgu = 0
      }


    }
    else if ( reflectionSubject.indexOf("탐+국,수,영중 상위 2개 영역") >= 0 ) {
      var scores = [totalScore.korean, totalScore.math, totalScore.english]
      
      scores.sort(function(a,b){
        return b - a
      })

      if ( scores[2] == totalScore.korean ) {
        newScore.korean = 0
        extraScore.korean = 0
      }
      else if ( scores[2] == totalScore.english) {
        newScore.english = 0
        extraScore.english = 0
      }
      else {
        newScore.math = 0
        extraScore.math = 0
      }
    }

    else if ( reflectionSubject.indexOf("국,수,영,탐,제2외국어중 택3") >= 0 ) {


    }

    else {
      console.log("simpleType")
    }

    

    const total = newScore.korean + newScore.math + newScore.english + newScore.tamgu + newScore.history + extraScore.korean + extraScore.math + extraScore.english + extraScore.tamgu + extraScore.history

    console.log( newScore.korean)
    console.log( newScore.math)
    console.log( newScore.english)
    console.log(newScore.tamgu)
    console.log(newScore.history)

    console.log(score.userId)
    console.log(majorData.id)

  
    if ( create == true ) {


      const recommendations = await majorDataService.findRecommendations(total)

      console.log(recommendations)
      const modelObj = {
        score,
        majorDataId : majorData.id,
        userId : score.userId,
        perfectScore,
        score : newScore,
        extraScore : extraScore,
        totalScore : total,
        recommendations
      }


      return modelObj
    }
    else {
      return total
    }


  }

}
