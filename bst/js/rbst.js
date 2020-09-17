"use strict";

class Node extends BaseNode {
  constructor(val) {
    super(val);
    this.size = 1;
  }

  remove_left() {
    const left = this.left;
    if(left !== null) {
      this.left = left.prt = null;
      this.size -= left.size;
    }
    return left;
  }

  remove_right() {
    const right = this.right;
    if(right !== null) {
      this.right = right.prt = null;
      this.size -= right.size;
    }
    return right;
  }

  set_left(node) {
    this.remove_left();

    if(node !== null) {
      if(node.prt !== null) {
        node.prt.remove_child(node);
      }
      node.prt = this;
      this.size += node.size;
    }

    this.left = node;
  }

  set_right(node) {
    this.remove_right();

    if(node !== null) {
      if(node.prt !== null) {
        node.prt.remove_child(node);
      }
      node.prt = this;
      this.size += node.size;
    }
    this.right = node;
  }

  update_size() {
    let size = 1;
    if(this.left !== null) size += this.left.size;
    if(this.right !== null) size += this.right.size;
    return this.size = size;
  }
}

class RandomizedBinarySearchTree {
  constructor() {
    this.root = null;
    this.left = this.right = null;
    this.pv = -1;
    this.cur = null;
    this.update_nodes = new Set();
    this.current_nodes = [];
    this.prv_d = -1;
  }

  find(x) {
    this.update_nodes = new Set();
    this.current_nodes = [];
    if(this.root === null) {
      return false;
    }
    let node = this.root;
    while(node.val !== x) {
      this.update_nodes.add(node);
      if(x < node.val) {
        if(node.left === null) break;
        node = node.left;
      } else {
        if(node.right === null) break;
        node = node.right;
      }
    }
    if(node.val === x) {
      return true;
    }
    return false;
  }

  finish_delete() {
    let node = this.cur;
    while(node !== null) {
      node.update_size();
      node = node.prt;
    }
  }

  delete_step() {
    this.current_nodes = [this.cur, this.left, this.right];
    if(this.left === null || this.right === null) {
      const node = (this.left || this.right);
      if(node !== null) {
        this.update_nodes.add(node);
      }
      if(this.prv_d == 0) {
        this.cur.set_left(node);
      } else if(this.prv_d == 1) {
        this.cur.set_right(node);
      } else {
        this.root = node;
      }
      this.cur = node;
      this.left = this.right = null;
      return false;
    }
    const a = this.left.size, b = this.right.size;
    if(randint(a + b) < a) {
      const left = this.left;
      this.update_nodes.add(left);
      if(this.prv_d === 0) {
        this.cur.set_left(left);
      } else if(this.prv_d === 1) {
        this.cur.set_right(left);
      } else {
        this.root = left;
      }
      this.cur = left;
      this.left = left.remove_right();
      this.prv_d = 1;
    } else {
      const right = this.right;
      this.update_nodes.add(right);
      if(this.prv_d === 1) {
        this.cur.set_right(right);
      } else if(this.prv_d === 0) {
        this.cur.set_left(right);
      } else {
        this.root = right;
      }
      this.cur = right;
      this.right = right.remove_left();
      this.prv_d = 0;
    }
    return true;
  }

  prepare_delete(x) {
    this.current_nodes = [];
    let node = this.root;
    while(node !== null) {
      if(node.val === x) break;
      this.update_nodes.add(node);
      if(x < node.val) {
        node = node.left;
      } else {
        node = node.right;
      }
    }

    if(node === null) {
      return null;
    }

    if(node.prt !== null) {
      const prt = node.prt;
      this.prv_d = (prt.is_left(node) ? 0 : 1);
      prt.remove_child(node);
      this.cur = prt;
    } else {
      this.prv_d = -1;
      this.root = this.cur = null;
    }

    this.left = node.remove_left();
    this.right = node.remove_right();
    return node;
  }

  insert_step() {
    this.current_nodes = [];
    const node = this.cur;
    if(node === null) {
      return false;
    }
    this.update_nodes.add(node);
    this.current_nodes = [this.left, this.right, node];
    if(node.val < this.pv) {
      const left = this.left;
      if(left.val == this.pv) {
        left.set_left(node);
      } else {
        left.set_right(node);
      }
      this.cur = node.remove_right();
      this.left = node;
    } else {
      const right = this.right;
      if(right.val == this.pv) {
        right.set_right(node);
      } else {
        right.set_left(node);
      }
      this.cur = node.remove_left();
      this.right = node;
    }
    return true;
  }

  finish_insert() {
    let node;
    node = this.left;
    while(node !== null) {
      node.update_size();
      node = node.prt;
    }
    node = this.right;
    while(node !== null) {
      node.update_size();
      node = node.prt;
    }
  }

  prepare_insert(x) {
    // before insert(), check if key = x does not exist in the tree
    this.update_nodes = new Set();
    this.current_nodes = [];
    const new_node = new Node(x);
    this.left = this.right = new_node;
    let prv = null;
    this.pv = x;
    if(this.root == null) {
      this.root = new_node;
      this.cur = null;
      return new_node;
    }
    let node = this.root;
    while(node !== null) {
      if(node.size <= randint(node.size + 1)) {
        break;
      }
      prv = node;
      this.update_nodes.add(node);
      if(x < node.val) {
        node = node.left;
      } else {
        node = node.right;
      }
    }

    if(prv !== null) {
      if(x < prv.val) {
        prv.set_left(new_node);
      } else {
        prv.set_right(new_node);
      }
    } else {
      this.root = new_node;
    }

    this.cur = node;
    return new_node;
  }

  get_update_nodes() {
    return Array.from(this.update_nodes.values());
  }

  get_current_nodes() {
    return this.current_nodes.filter(node => node !== null);
  }
}

window.onload = () => {
  const tree = new RandomizedBinarySearchTree();

  const node_view = {};
  const node_map = {};
  let tl = null;

  const canvas = document.querySelector("svg.canvas");
  const nodes = document.querySelector(".nodes");
  const edges = document.querySelector(".edges");
  const slider = document.querySelector(".anime-slider");
  slider.oninput = ((el) => {
    if(tl !== null) {
      tl.seek(tl.duration * (slider.value / 100));
    }
  });
  let delete_n_id = null;

  const add_node = (v, node) => {
    const n_id = node.id;
    nodes.appendChild(createNode(v, n_id));
    edges.appendChild(createEdge(v, n_id));
    const d_node = document.querySelector(`g.node${n_id}`);
    const d_edge = document.querySelector(`path.edge${n_id}`);

    node_view[v] = {
      "node": d_node,
      "edge": d_edge,
    };
    node_map[n_id] = node;
  };

  const change_canvas_size = (width, height) => {
    const style = canvas.style;
    style["width"] = `${width}px`;
    style["height"] = `${height}px`;
  };

  const translate_obj = (result, t_node, c_nodes) => {
    default_translate_obj(node_map, result, tl);
    const t_view = (t_node !== null ? node_view[t_node.val].node : null);
    const c_views = (c_nodes !== null ? c_nodes.map(node => node_view[node.val].node) : []);
    tl.add({
      targets: ['circle.node-circle'],
      duration: 1000,
      changeBegin: (tl) => {
        begin_change_current_color(t_view, c_views);
      },
      changeComplete: (tl) => {
        end_change_current_color(t_view, c_views);
      },
    }, '-=1000');
  }

  const init_timeline = () => {
    if(delete_n_id !== null) {
      const n_id = delete_n_id;
      removeNode(n_id);
      removeEdge(n_id);
      delete_n_id = null;
    }
    if(tl !== null) {
      tl.seek(tl.duration);
    }
    tl = anime.timeline({
      duration: 1000,
      update: (anim) => {
        slider.value = tl.progress;
      },
    });
  };

  const remove_tree_node = (v) => {
    const node_num = Object.keys(node_view).length;

    init_timeline();

    tl.add({
      duration: 500,
    });

    let max_depth = traverse(tree.root).depth;

    const updates = new Set();

    let v_n_id = null;
    let target_node = null;
    if(tree.find(v)) {
      const node = tree.prepare_delete(v);

      target_node = node_view[v].node;
      v_n_id = node.id;

      hide_nodes(tl, [`g.node${v_n_id}`], [`path.edge${v_n_id}`]);

      let updated = true;
      while(tree.delete_step()) {
        const result = {};
        const result_l = traverse(tree.left);
        const result_m = traverse(tree.root);
        const result_r = traverse(tree.right);

        max_depth = Math.max(max_depth, result_m.depth);

        const tmp = [];
        for(let n_id in result_m.ps) {
          const [_, y] = result_m.ps[n_id];
          const node = node_map[n_id];
          tmp.push([node, y]);
        }
        const c_base = (tree.cur !== null ? result_m.ps[tree.cur.id][1] : 0);
        max_depth = Math.max(max_depth, result_l.depth + c_base + 2, result_r.depth + c_base + 2);
        for(let n_id in result_l.ps) {
          const [_, y] = result_l.ps[n_id];
          const node = node_map[n_id];
          tmp.push([node, y + c_base + 2]);
        }
        for(let n_id in result_r.ps) {
          const [_, y] = result_r.ps[n_id];
          const node = node_map[n_id];
          tmp.push([node, y + c_base + 2]);
        }
        tmp.push([node, 0]);
        tmp.sort((x, y) => x[0].val - y[0].val);
        let cursor = 0;
        for(let [node, pos] of tmp) {
          result[node.id] = [cursor++, pos];
        }
        const c_nodes = tree.get_current_nodes();
        translate_obj(result, node, c_nodes);
      }

      tree.finish_delete();

      {
        const result_m = traverse(tree.root);
        const result = result_m.ps;
        result[v_n_id] = [0, 0];
        max_depth = Math.max(max_depth, result_m.depth);

        const c_nodes = tree.get_current_nodes();
        translate_obj(result, node, c_nodes);
      }

      for(let e of tree.get_update_nodes()) {
        updates.add(e);
      }

      delete node_view[v];
      delete node_map[v_n_id];
    }

    const update_nodes = Array.from(updates.values()).map(node => node_view[node.val].node);
    tl.changeBegin = () => {
      begin_change_color(target_node, update_nodes);
    };
    tl.changeComplete = () => {
      end_change_color(target_node, update_nodes);
    };
    delete_n_id = v_n_id;

    change_canvas_size(
      (node_num+2) * NODE_W + BASE_X*2,
      (max_depth+1) * NODE_H + BASE_Y*2
    );
  };

  const add_tree_node = (v) => {
    init_timeline();

    tl.add({
      duration: 500,
    });

    let max_depth = traverse(tree.root).depth;

    if(!tree.find(v)) {
      const node = tree.prepare_insert(v);
      const v_n_id = node.id;
      if(node !== null) {
        add_node(v, node);
      }
      let updated = true;
      while(true) {
        const result = {};
        const result_m = traverse(tree.root);
        const result_c = traverse(tree.cur);

        max_depth = Math.max(max_depth, result_m.depth);
        const tmp = [];

        for(let n_id in result_m.ps) {
          const [_, y] = result_m.ps[n_id];
          const node = node_map[n_id];
          tmp.push([node, y]);
        }
        const c_base = Math.max(result_m.ps[tree.left.id][1], result_m.ps[tree.right.id][1]);
        max_depth = Math.max(max_depth, result_c.depth + c_base + 2);
        for(let n_id in result_c.ps) {
          const [_, y] = result_c.ps[n_id];
          const node = node_map[n_id];
          tmp.push([node, y + c_base + 2]);
        }
        tmp.sort((x, y) => x[0].val - y[0].val);
        let cursor = 0;
        for(let [node, pos] of tmp) {
          result[node.id] = [cursor++, pos];
        }
        const c_nodes = tree.get_current_nodes();
        translate_obj(result, node, c_nodes);

        if(!updated) {
          break;
        }
        updated = tree.insert_step();
      }

      tree.finish_insert();
    }

    const target_node = node_view[v].node;

    const update_nodes = tree.get_update_nodes().map(node => node_view[node.val].node);
    tl.changeBegin = () => {
      begin_change_color(target_node, update_nodes);
    };
    tl.changeComplete = () => {
      end_change_color(target_node, update_nodes);
    };

    const node_num = Object.keys(node_view).length;
    change_canvas_size(
      (node_num+2) * NODE_W + BASE_X*2,
      (max_depth+1) * NODE_H + BASE_Y*2
    );
  };

  set_add_random(add_tree_node);
  set_remove_random(remove_tree_node, node_view);
  set_add_inc(add_tree_node);
  set_add_dec(add_tree_node);
  set_add_value(add_tree_node);
  set_remove_value(remove_tree_node);
};
