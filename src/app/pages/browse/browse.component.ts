import { Component, OnInit, inject } from '@angular/core';
import { HeaderComponent } from '../../core/components/header/header.component';
import { BannerComponent } from '../../core/components/banner/banner.component';
import { CommonModule } from '@angular/common';
import { MovieService } from '../../shared/services/movie.service';
import { log } from 'console';
import { MovieCarouselComponent } from '../../shared/components/movie-carousel/movie-carousel.component';
import { IVideoContent } from '../../shared/models/video.content.interface';
import { Observable, forkJoin, map } from 'rxjs';

@Component({
  selector: 'app-browse',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    BannerComponent,
    MovieCarouselComponent,
  ],
  templateUrl: './browse.component.html',
  styleUrl: './browse.component.scss',
})
export class BrowseComponent implements OnInit {
  movieServices = inject(MovieService);
  bannerDetail$=new Observable<any>();
  bannerVideo$=new Observable<any>();

  movies: IVideoContent[] = [];
  tvShows: IVideoContent[] = [];
  ratedMovies: IVideoContent[] = [];
  nowPlayingMovies: IVideoContent[] = [];
  popularMovies: IVideoContent[] = [];
  topRatedMovies: IVideoContent[] = [];
  upcomingMovies: IVideoContent[] = [];
  sources = [
    this.movieServices.getMovies(),
    this.movieServices.getTvShows(),
    this.movieServices.getRatedMovies(),
    this.movieServices.getNowPlayingMovies(),
    this.movieServices.getUpcomingMovies(),
    this.movieServices.getPopularMovies(),
    this.movieServices.getTopRated(),
  ];
  ngOnInit(): void {
    forkJoin(this.sources)
      .pipe(
        map(
          ([
            movies,
            tvShows,
            ratedMovies,
            nowPlaying,
            upcoming,
            popular,
            topRated,
          ]) => {
            this.bannerDetail$=this.movieServices.getBannerDetail(movies.results[0].id);
            this.bannerVideo$=this.movieServices.getBannerVideo(movies.results[0].id);
            return {
              movies,
              tvShows,
              ratedMovies,
              nowPlaying,
              upcoming,
              popular,
              topRated,
            };
          }
        )
      )
      .subscribe((res: any) => {
        this.movies = res.movies.results as IVideoContent[];
        this.tvShows = res.tvShows.results as IVideoContent[];
        this.ratedMovies = res.ratedMovies.results as IVideoContent[];
        this.nowPlayingMovies = res.nowPlaying.results as IVideoContent[];
        this.upcomingMovies = res.upcoming.results as IVideoContent[];
        this.popularMovies = res.popular.results as IVideoContent[];
        this.topRatedMovies = res.topRated.results as IVideoContent[];
      });
  }
}
