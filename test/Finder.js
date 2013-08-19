// Generated by CoffeeScript 1.6.3
(function() {
  var Finder, dir, fs, path, should;

  should = require('should');

  path = require('path');

  fs = require('fs');

  dir = path.resolve('./data');

  Finder = require('../lib/Finder');

  describe('Finder', function() {
    describe('base', function() {
      return it('should throw an error if path is not directory', function() {
        return (function() {
          return new Finder("" + dir + "/two");
        }).should["throw"]();
      });
    });
    describe('#findFiles()', function() {
      return it('should return file names from root folder', function() {
        return Finder["in"](dir).findFiles().should.eql(["" + dir + "/0", "" + dir + "/1", "" + dir + "/five", "" + dir + "/one", "" + dir + "/three", "" + dir + "/two"]);
      });
    });
    describe('#findDirectories()', function() {
      return it('should return directory names from root folder', function() {
        return Finder["in"](dir).findDirectories().should.eql(["" + dir + "/eight", "" + dir + "/seven", "" + dir + "/six"]);
      });
    });
    describe('#find()', function() {
      return it('should return file and directory names from root folder', function() {
        return Finder["in"](dir).find().should.eql(["" + dir + "/0", "" + dir + "/1", "" + dir + "/eight", "" + dir + "/five", "" + dir + "/one", "" + dir + "/seven", "" + dir + "/six", "" + dir + "/three", "" + dir + "/two"]);
      });
    });
    describe('#recursive()', function() {
      return it('should return file names recursively from find* methods', function() {
        return Finder.from(dir).findFiles().should.eql(["" + dir + "/0", "" + dir + "/1", "" + dir + "/eight/3/4/file.json", "" + dir + "/five", "" + dir + "/one", "" + dir + "/seven/13", "" + dir + "/seven/14", "" + dir + "/seven/twelve", "" + dir + "/six/eleven", "" + dir + "/six/nine", "" + dir + "/six/ten", "" + dir + "/three", "" + dir + "/two"]);
      });
    });
    describe('#exclude()', function() {
      return it('should return files which has not got numbers in name', function() {
        return Finder["in"](dir).exclude(['<[0-9]>']).findFiles().should.eql(["" + dir + "/five", "" + dir + "/one", "" + dir + "/three", "" + dir + "/two"]);
      });
    });
    describe('#showSystemFiles()', function() {
      return it('should return also system, hide and temp files', function() {
        return Finder["in"](dir).showSystemFiles().findFiles().should.eql(["" + dir + "/.cache", "" + dir + "/0", "" + dir + "/1", "" + dir + "/five", "" + dir + "/five~", "" + dir + "/one", "" + dir + "/three", "" + dir + "/two"]);
      });
    });
    describe('#lookUp()', function() {
      it('should return path to file in parent directory', function() {
        return Finder["in"]("" + dir + "/eight/3/4").lookUp(4).showSystemFiles().findFiles('._.js').should.be.eql(["" + dir + "/eight/._.js"]);
      });
      return it('should return path to file in parent directory recursively', function() {
        return Finder.from("" + dir + "/eight/3/4").lookUp(4).findFiles('twelve').should.be.eql(["" + dir + "/seven/twelve"]);
      });
    });
    describe('filters', function() {
      describe('#size()', function() {
        return it('should return files with size between 2000B and 3000B', function() {
          return Finder["in"](dir).size('>=', 2000).size('<=', 3000).findFiles().should.eql(["" + dir + "/five"]);
        });
      });
      describe('#date()', function() {
        return it('should return files which were changed in less than 1 minute ago', function() {
          fs.writeFileSync("" + dir + "/two", 'just some changes');
          return Finder["in"](dir).date('>', {
            minutes: 1
          }).findFiles().should.eql(["" + dir + "/two"]);
        });
      });
      return describe('#filter()', function() {
        return it('should return files which names are 3 chars length', function() {
          var filter;
          filter = function(stat, file) {
            var name;
            name = path.basename(file, path.extname(file));
            return name.length === 3;
          };
          return Finder["in"](dir).filter(filter).findFiles().should.eql(["" + dir + "/one", "" + dir + "/two"]);
        });
      });
    });
    return describe('utils', function() {
      describe('#parseDirectory()', function() {
        return it('should return object with directory and mask from path to find* methods', function() {
          Finder.parseDirectory("" + dir + "/one").should.eql({
            directory: "" + dir + "/one",
            mask: null
          });
          Finder.parseDirectory("" + dir + "<(five|three)*>").should.eql({
            directory: dir,
            mask: '<(five|three)*>'
          });
          return Finder.parseDirectory("" + dir + "*<e$>").should.eql({
            directory: dir,
            mask: '*<e$>'
          });
        });
      });
      describe('#escapeForRegex()', function() {
        return it('should return escaped string for using it in regexp', function() {
          return Finder.escapeForRegex('.h[]e()l+|l?^o$').should.be.equal('\\.h\\[\\]e\\(\\)l\\+\\|l\\?\\^o\\$');
        });
      });
      return describe('#normalizePattern()', function() {
        return it('should return proper regular expression from path parameter', function() {
          return Finder.normalizePattern("" + dir + "/.temp/<(one|two)>*<$>").should.be.equal("" + dir + "/\\.temp/(one|two)[0-9a-zA-Z/.-_ ]+$");
        });
      });
    });
  });

}).call(this);