var fs = require('fs');
var chai = require('chai');
var sinon = require('sinon');

chai.use(require('chai-as-promised'));
chai.use(require('sinon-chai'));
chai.use(require('chai-things'));

var expect = chai.expect;
var should = chai.should();

var promise = require('q');
var proxy = require('qlik-fake-proxy');

var exports = require('../index.js');

var readFile = promise.denodeify(fs.readFile);

function check(done, f) {

	return promise().then(() => {
		try {
			return f();
		} catch (e) {
			return promise.reject(e);
		}
	}).then(() => {
		done();
	}).fail((err) => {
		done(err);
	}); 

}

describe('qps API...', function() {

	it('should be defined', function() {
		expect(exports).to.not.be.undefined;
		expect(exports).to.be.a('function');
		
		var qps = exports({ qpsRestUri: 'https://localhost:4243/qps' });
		
		expect(qps).to.not.be.undefined;
	});
	
	describe('restUri...', function() {

		it('should be defined', function() {

			var qps = exports({ qpsRestUri: 'https://localhost:4243/qps' });
			expect(qps.restUri).to.not.be.undefined;
			expect(qps.restUri).to.be.a('function');
			
		});
		
		it('should parse URI with qpsRestUri', function() {
			
			var qps1 = exports({ qpsRestUri: 'https://localhost:4243/qps' });
			expect(qps1.restUri()).to.not.be.undefined;
			expect(qps1.restUri()).to.be.a('string');
			expect(qps1.restUri()).to.equal('https://localhost:4243/qps');
			
			var qps2 = exports({ qpsRestUri: 'https://localhost/qps' });
			expect(qps2.restUri()).to.equal('https://localhost/qps');
			
			var qps3 = exports({ qpsRestUri: 'http://localhost' });
			expect(qps3.restUri()).to.equal('http://localhost/');
			
			var qps4 = exports({ qpsRestUri: 'http://localhost:8080/ticket/bli' });
			expect(qps4.restUri()).to.equal('http://localhost:8080/ticket/bli');
		
		});
		
		it('should parse URI with restUri', function() {
			
			var qps1 = exports({ restUri: 'https://localhost:4243' });
			expect(qps1.restUri()).to.not.be.undefined;
			expect(qps1.restUri()).to.be.a('string');
			expect(qps1.restUri()).to.equal('https://localhost:4243/qps/');
			
			var qps2 = exports({ restUri: 'https://localhost' });
			expect(qps2.restUri()).to.equal('https://localhost:4243/qps/');
			
			var qps3 = exports({ restUri: 'http://localhost' });
			expect(qps3.restUri()).to.equal('https://localhost:4243/qps/');
			
			var qps4 = exports({ restUri: 'http://localhost:8080/toto' });
			expect(qps4.restUri()).to.equal('https://localhost:4243/qps/');
		
		});
		
	});
	
	describe('api...', function() {
		
		var server, qps;

		beforeEach(function(done) {
			promise.all([
				proxy.createProxy({ port: 1337, secure: true }),
				readFile('./node_modules/qlik-fake-proxy/certs/client_key.pem'),
				readFile('./node_modules/qlik-fake-proxy/certs/client.pem'),
				readFile('./node_modules/qlik-fake-proxy/certs/root.pem'),
			]).then((reply) => {
				check(done, function() {
					server = reply[0];
					qps = exports({
						qpsRestUri: `https://localhost:${reply[0].address().port}/qps`,
						key: reply[1],
						cert: reply[2],
						ca: reply[3]
					});
				});
			}).fail((err) => {
				done(err);
			});
		});
		
		afterEach((done) => {
			check(done, function() {
				qps = undefined;
				server.close();
			});
		});
		
		describe('ticket...', function() {

			it('should be defined', function() {

				expect(qps.ticket).to.not.be.undefined;
				expect(qps.ticket).to.be.a('object');
				
			});
			
			describe('post...', function() {
				
				it('should be defined', function() {

					expect(qps.ticket.post).to.not.be.undefined;
					expect(qps.ticket.post).to.be.a('function');
					
				});
				
				it('should work', function(done) {

					qps.ticket.post({
						UserId: 'lft',
						UserDirectory: 'qlik',
						Attributes: []
					}).should.eventually.have.property('Ticket').to.match(/^[\-_\.a-zA-Z0-9]*$/).to.have.length(16).should.notify(done);
					
				});
				
			});
			
		});
		
		describe('user...', function() {
            
            it('should be defined', function() {

				expect(qps.user).to.not.be.undefined;
				expect(qps.user).to.be.a('object');
				
			});
			
			describe('get...', function() {
                
                it('should be defined', function() {

					expect(qps.user.get).to.not.be.undefined;
					expect(qps.user.get).to.be.a('function');
					
				});
                
                it('should work', function(done) {

					qps.user.get('qlik', 'lft').should.notify(done);
					
				});
				
			});
			
			describe('delete...', function() {
                
                it('should be defined', function() {

					expect(qps.user.delete).to.not.be.undefined;
					expect(qps.user.delete).to.be.a('function');
					
				});
                
                it('should work', function(done) {

					qps.user.delete('qlik', 'lft').should.notify(done);
					
				});
				
			});
			
		});
		
		describe('session...', function() {
            
            it('should be defined', function() {

				expect(qps.session).to.not.be.undefined;
				expect(qps.session).to.be.a('object');
				
			});
			
			describe('get...', function() {
                
                it('should be defined', function() {

					expect(qps.session.get).to.not.be.undefined;
					expect(qps.session.get).to.be.a('function');
					
				});
                
                it('should work', function(done) {

					qps.session.get('1234567890123456').should.notify(done);
					
				});
				
			});
			
			describe('post...', function() {
                
                it('should be defined', function() {

					expect(qps.session.post).to.not.be.undefined;
					expect(qps.session.post).to.be.a('function');
					
				});
                
                it('should work', function(done) {

					qps.session.post({
						UserId: 'lft',
						UserDirectory: 'qlik',
						Attributes: [],
                        SessionId: '1234567890123456'
					}).should.notify(done);
					
				});
				
			});
			
			describe('delete...', function() {
                
                it('should be defined', function() {

					expect(qps.session.delete).to.not.be.undefined;
					expect(qps.session.delete).to.be.a('function');
					
				});
                
                it('should work', function(done) {

					qps.session.delete('1234567890123456').should.notify(done);
					
				});
				
			});
			
		});
		
	});

    describe('enigma...', () => {
        var cb = sinon.spy();
    
        var enigmaMock = {
            _services: [],
            registerService: function(service, connect) {
                enigmaMock._services[service] = connect;
                cb(service, connect);
            },
            getService: function(service, config) {
                enigmaMock._services[service](config);
            }
        }
        
        it('should register', () => {
            exports.registerOn(enigmaMock)
            expect(cb).to.have.been.called;
            
            enigmaMock.getService('qps', {});
        })
    })


});