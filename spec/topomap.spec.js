describe("topoMap", function() {
	it("should load properly", function() {
		expect(update).toEqual(jasmine.any(Function));
	});
});

describe("The UI functions", function() {
	beforeEach(function() {
		$('<div id="toddler"></div>').appendTo('body');
	});

	afterEach(function() {
		$('#toddler').remove()
	});

	it("should contain get()", function() {
		expect(get).toEqual(jasmine.any(Function));
	});
	it("...which should get elements from the DOM", function() {
		expect(get("toddler")).toEqual(document.getElementById('toddler'));
		expect(get("toddler")).toBe(document.getElementById('toddler'));
	});
	it("should contain update()", function() {
		expect(update).toEqual(jasmine.any(Function));
	});
	it("...which should return the element it is working on", function(){
		var elem = document.getElementById('toddler');
		expect(update(elem, "new text")).toEqual(document.getElementById('toddler'));
	});
	xit("...which should add text to elements from the DOM", function() {

	});
});
