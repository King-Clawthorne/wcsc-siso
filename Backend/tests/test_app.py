import Backend.app as app

def test_app():
    assert app.index() == "Hello World"