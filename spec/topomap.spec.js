describe("topoMap", function () {
    it("should load properly", function () {
        expect(update).toEqual(jasmine.any(Function));
    });
});

describe("The UI functions", function () {
    beforeEach(function () {
        $('<div id="toddler"></div>').appendTo('body');
    });

    afterEach(function () {
        $('#toddler').remove()
    });
    it("should contain get()", function () {
        expect(get).toEqual(jasmine.any(Function));
    });
    describe("The function get()", function (){
        it("...should get elements from the DOM", function () {
            expect(get("toddler")).toEqual(document.getElementById('toddler'));
            expect(get("toddler")).toBe(document.getElementById('toddler'));
        });
    });

    describe("//Another way to organize this page:", function (){});

    describe("The function update()", function (){
        it("is a function", function () {
            expect(update).toEqual(jasmine.any(Function));
        });
        it("that returns the element it is working on", function () {
            var elem = document.getElementById('toddler');
            expect(update(elem, "new text")).toEqual(document.getElementById('toddler'));
        });
        it("adds text to the element", function () {
            var elem = document.getElementById('toddler');
            update(elem, "test text");
            expect(elem.textContent).toEqual("test text");
        });
    });


    describe("show", function(){
        it("is a function", function () {
            expect(show).toEqual(jasmine.any(Function));
        });
        it("that changes an element display to block", function () {
            show('toddler');
            var elem = document.getElementById('toddler');
            expect(elem.style.display).toEqual('block');
            elem.style.display = 'none';
            show('toddler');
            expect(elem.style.display).toEqual('block');
        });
    });


    describe("hide", function(){
        it("is a function", function () {
            expect(hide).toEqual(jasmine.any(Function));
        });
        it("that changes an element display to none", function () {
            var elem = document.getElementById('toddler');
            hide('toddler');
            expect(elem.style.display).toEqual('none');
            elem.style.display = 'block';
            hide('toddler');
            expect(elem.style.display).toEqual('none');
        });
    });


    describe("toggleshow", function(){
        it("is a function", function () {
            expect(toggleshow).toEqual(jasmine.any(Function));
        });
        it("that changes an element display to none from block", function () {
            var elem = document.getElementById('toddler');
            elem.style.display = 'none';
            toggleshow('toddler');
            expect(elem.style.display).toEqual('block');
        });
        it("and from block to none", function () {
            var elem = document.getElementById('toddler');
            elem.style.display = 'block';
            toggleshow('toddler');
            expect(elem.style.display).toEqual('none');
        });
        it("and works even if you click it twice", function () {
            var elem = document.getElementById('toddler');
            elem.style.display = 'block';
            toggleshow('toddler');
            toggleshow('toddler');
            expect(elem.style.display).toEqual('block');
            elem.style.display = 'none';
            toggleshow('toddler');
            toggleshow('toddler');
            expect(elem.style.display).toEqual('none');
        });
        it("it changes elements to hide if the display is not specified", function () {
            var elem = document.getElementById('toddler');
            //elem.style.display = 'none';
            toggleshow('toddler');
            expect(elem.style.display).toEqual('none');
        });
    });


});
