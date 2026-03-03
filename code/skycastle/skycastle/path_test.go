package skycastle

import "testing"

func TestPath(t *testing.T) {
	got := dropTrailingPathSeparator("file/test/")
	expected := "file/test"
	if got != expected {
		t.Errorf("Expected '%s', got '%s'", expected, got)
	}

	got = dropTrailingPathSeparator("/")
	expected = "/"
	if got != expected {
		t.Errorf("Expected '%s', got '%s'", expected, got)
	}

	got = dropFileName("/directory/file.ext")
	expected = "/directory/"
	if got != expected {
		t.Errorf("Expected '%s', got '%s'", expected, got)
	}

	got1, got2 := splitFileName("/directory/file.ext")
	expected1, expected2 := "/directory/", "file.ext"
	if got1 != expected1 || got2 != expected2 {
		t.Errorf("Expected '%s' and '%s', got '%s' and '%s'", expected1, expected2, got1, got2)
	}

	got1, got2 = splitFileName("file/bob.txt")
	expected1, expected2 = "file/", "bob.txt"
	if got1 != expected1 || got2 != expected2 {
		t.Errorf("Expected '%s' and '%s', got '%s' and '%s'", expected1, expected2, got1, got2)
	}

	got1, got2 = splitFileName("/")
	expected1, expected2 = "/", ""
	if got1 != expected1 || got2 != expected2 {
		t.Errorf("Expected '%s' and '%s', got '%s' and '%s'", expected1, expected2, got1, got2)
	}

	gots := []string{
		"/file/\\test////",
		"/file/./test",
		"/test/file/../bob/fred/",
		"../bob/fred/",
		"/a/../c",
		"./bob/fred/",
		".",
		"./",
		"./.",
		"/./",
		"/",
		"bob/fred/.",
		"//home",
	}

	expecteds := []string{
		"/file/\\test/",
		"/file/test",
		"/test/file/../bob/fred/",
		"../bob/fred/",
		"/a/../c",
		"bob/fred/",
		".",
		"./",
		"./",
		"/",
		"/",
		"bob/fred/",
		"/home",
	}

	for i := range gots {
		got := normalize(gots[i])
		expected := expecteds[i]
		if got != expected {
			t.Errorf("Expected '%s', got '%s'", expected, got)
		}
	}
}
