import { Controller, Get, HttpCode } from "@nestjs/common";
import { Auth } from "../auth/decorator/auth.decorator";
import { CurrentUser } from "../auth/decorator/user.decorator";
import { RecommendationService } from "./recommendation.service";

@Controller("recommendation")
export class RecommendationController {
  constructor(private readonly recommendationService: RecommendationService) {
  }
  
  // get recomendation array for other response
  // get mix of recomendation array
  // get most recent artist from history
  
  @HttpCode(200)
  @Auth()
  @Get("/get")
  getRecommendation(@CurrentUser("id") id: number) {
    return this.recommendationService.getRecommendation(id);
  }
  
  @HttpCode(200)
  @Auth()
  @Get("/get-mix")
  getMix(@CurrentUser("id") id: number) {
    return this.recommendationService.getMix(id);
  }
  
  @HttpCode(200)
  @Auth()
  @Get("/get-most-recent-artist")
  getMostRecentArtist(@CurrentUser("id") id: number) {
    return this.recommendationService.getMostRecentArtist(id);
  }
}
