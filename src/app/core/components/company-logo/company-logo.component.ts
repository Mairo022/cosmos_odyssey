import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-company-logo',
  standalone: true,
  template: `
    <img [src]="getLogo(company)" [alt]="company" class="company_logo" width="35px">
  `
})
export class CompanyLogoComponent {
  @Input() company = ''
  path = "assets/company_logos/explore-origin.svg"

  private companyLogoMap = new Map<string, string>([
    ['SpaceX', 'assets/company_logos/spacex.svg'],
    ['Explore Origin', 'assets/company_logos/explore-origin.svg'],
    ['Space Odyssey', 'assets/company_logos/space-odyssey.svg'],
    ['Explore Dynamite', 'assets/company_logos/explore-dynamite.svg'],
    ['Galaxy Express', 'assets/company_logos/galaxy-express.svg'],
    ['Spacegenix', 'assets/company_logos/spacegenix.svg'],
    ['Travel Nova', 'assets/company_logos/travel-nova.svg'],
    ['Space Piper', 'assets/company_logos/space-piper.svg'],
    ['Spacelux', 'assets/company_logos/spacelux.svg'],
    ['Space Voyager', 'assets/company_logos/space-voyager.svg']
  ])

  getLogo(company: string): string {
    return this.companyLogoMap.get(company) ?? ""
  }
}