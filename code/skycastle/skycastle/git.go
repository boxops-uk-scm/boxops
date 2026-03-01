package skycastle

import (
	"errors"
	"fmt"

	"github.com/go-git/go-git/v5"
)

var ErrDirtyRepo = errors.New("repo is not clean (differs from HEAD)")

func RepoVersion(repoPath string) (string, error) {
	repo, err := git.PlainOpen(repoPath)
	if err != nil {
		return "", err
	}

	wt, err := repo.Worktree()
	if err != nil {
		return "", err
	}

	st, err := wt.Status()
	if err != nil {
		return "", err
	}

	if !st.IsClean() {
		return "", fmt.Errorf("%w:\n%s", ErrDirtyRepo, st.String())
	}

	ref, err := repo.Head()
	if err != nil {
		return "", err
	}
	return ref.Hash().String(), nil
}
