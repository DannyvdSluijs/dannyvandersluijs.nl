import { Component, OnInit } from '@angular/core';

import { GithubService } from '../github.service';
import { Repository } from '../models/GitHub/Repository';
import { map } from 'rxjs/operators';
import { ZonedDateTime } from 'js-joda';

@Component({
  selector: 'app-github',
  templateUrl: './github.component.html',
  styleUrls: ['./github.component.css']
})
export class GithubComponent implements OnInit {

  repositories: Repository[];

  constructor(private gitHubService: GithubService) { }

  ngOnInit() {
    this.getMyRepositories();
  }

  getMyRepositories(): void {
    this.gitHubService.getRepositories()
      .pipe(map(data => data.filter(githubRepository => githubRepository.fork === false)))
      .pipe(map(repositories => repositories.sort(function(a: Repository, b: Repository): number {
        const dateA = ZonedDateTime.parse(a.updated_at);
        const dateB = ZonedDateTime.parse(b.updated_at);

        return dateB.compareTo(dateA);
      })))
      .subscribe(repositories => this.repositories = repositories);
  }
}
