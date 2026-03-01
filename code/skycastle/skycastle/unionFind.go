package skycastle

type UnionFind struct {
	parent map[NodeId]NodeId
	rank   map[NodeId]uint8
}

func NewUnionFind() *UnionFind {
	return &UnionFind{
		parent: make(map[NodeId]NodeId),
		rank:   make(map[NodeId]uint8),
	}
}

func (uf *UnionFind) Find(x NodeId) NodeId {
	px, ok := uf.parent[x]
	if !ok {
		uf.parent[x] = x
		uf.rank[x] = 0
		return x
	}

	if px != x {
		uf.parent[x] = uf.Find(px)
	}
	return uf.parent[x]
}

func (uf *UnionFind) Union(x, y NodeId) {
	rootX := uf.Find(x)
	rootY := uf.Find(y)

	if rootX == rootY {
		return
	}

	if uf.rank[rootX] < uf.rank[rootY] {
		uf.parent[rootX] = rootY
		return
	}

	if uf.rank[rootX] > uf.rank[rootY] {
		uf.parent[rootY] = rootX
		return
	}

	uf.parent[rootY] = rootX
	uf.rank[rootX]++
}
