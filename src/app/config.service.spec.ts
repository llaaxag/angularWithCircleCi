import { TestBed, inject , async} from '@angular/core/testing';

import { ConfigService } from './config.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';
import { TemplateParseResult } from '../../node_modules/@angular/compiler';

describe('ConfigService', () => {
  let configService: ConfigService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ConfigService]
    });
    configService = TestBed.get(ConfigService);
    httpMock = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', inject([ConfigService], (service: ConfigService) => {
    expect(service).toBeTruthy();
  }));

  it('vafalls', async (() => {
    console.log('VAFALLS');
    expect(configService).toBeTruthy();
    configService.getConfig().subscribe(data => console.log('DATA'), error => console.log('ERROR'));
    const req = httpMock.expectOne(r => {
      console.log('THE REQUEST URL', r.url);
      console.log('THE REQUEST METHOD', r.method);
      console.log('MATCHES?', r.url.match(/ett/));
      return !!r.url.match(/ett/);
    });
    // const req = httpMock.expectOne('./mySettings.json');
    // req.flush('hola');
    // const req = httpMock.match('/.mySettings.json/');
    // req[0].flush('hejsan');
  }));

  it('testing done', (done) => {
    // Funkar bättre med en timeout på en sekund men då blir testerna så långsamma
    setTimeout(() => {
      expect(true).toBeTruthy();
      done();
    }, 100);
  });

  it('testing setTimeout', async(() => {
    // Funkar bättre med en timeout på en sekund men då blir testerna så långsamma
    setTimeout(() => {
      expect(true).toBeTruthy();
    }, 100);
  }));

});
