"use strict";

function is_black(node) {
  return (node === null) || (node.color === Node.BLACK);
}

function is_red(node) {
  return !is_black(node);
}

class Node extends BaseNode {
  constructor(val) {
    super(val);
    // 0 = black, 1 = red
    this.color = Node.RED;
  }

  rotate_left() {
    const r = super.rotate_left();
    r.color = this.color;
    this.color = Node.RED;
    return r;
  }

  rotate_right() {
    const l = super.rotate_right();
    l.color = this.color;
    this.color = Node.RED;
    return l;
  }

  flip_colors() {
    this.color ^= 1;
    this.left.color ^= 1;
    this.right.color ^= 1;
  }

  get_sib(node) {
    return (this.is_left(node) ? this.right : this.left);
  }
}
Object.defineProperty(Node, 'BLACK', {
  value: 0,
  writable: false,
  enumerable: true,
  configurable: false,
});
Object.defineProperty(Node, 'RED', {
  value: 1,
  writable: false,
  enumerable: true,
  configurable: false,
});

class LeftLeaningRedBlackTree {
  constructor() {
    this.clear();
    this.update_nodes = new Set();
    this.current_nodes = [];
  }

  clear() {
    this.root = null;
    this.cur = null;
    this.dnode_color = null;
  }

  find(x) {
    this.update_nodes = new Set();
    if(this.root === null) {
      return false;
    }

    let node = this.root;
    while(node !== null && node.val !== x) {
      this.update_nodes.add(node);
      if(x < node.val) {
        node = node.left;
      } else {
        node = node.right;
      }
    }

    return (node !== null);
  }

  *insert(x) {
    this.update_nodes = new Set();
    this.current_nodes = [];
    if(this.root === null) {
      const new_node = new Node(x);
      this.current_nodes = [new_node];

      this.root = new_node;
      yield new_node;
      new_node.color = Node.BLACK;
      yield;
      return;
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

    if(x !== node.val) {
      const new_node = new Node(x);
      this.current_nodes = [new_node];
      if(x < node.val) {
        node.set_left(new_node);
      } else {
        node.set_right(new_node);
      }
      node = new_node;
      yield new_node;
    }

    while(node !== null) {
      // fixUp(node)
      if(is_red(node.right) && is_black(node.left)) {
        this.current_nodes = [node, node.left, node.right];
        this.update_nodes.add(node.left).add(node.right);
        node = node.rotate_left();
        if(node.prt === null) {
          this.root = node;
        }
        yield;
      }
      if(is_red(node.left) && is_red(node.left.left)) {
        this.current_nodes = [node, node.left, node.left.left];
        this.update_nodes.add(node.left).add(node.left.left);
        node = node.rotate_right();
        if(node.prt === null) {
          this.root = node;
        }
        yield;
      }
      if(is_red(node.left) && is_red(node.right)) {
        node.flip_colors();
        this.current_nodes = [node, node.left, node.right];
        this.update_nodes.add(node.left).add(node.right);
        yield;
      }

      node = node.prt;
    }
    if(is_red(this.root.color)) {
      this.current_nodes = [node];
      this.root.color = Node.BLACK;
      yield;
    }
  }

  *remove(x) {
    this.update_nodes = new Set();
    this.current_nodes = [];
    let node = this.root;
    while(node !== null) {
      this.update_nodes.add(node);
      if(x < node.val) {
        if(node.left === null) {
          return;
        }
        if(is_black(node.left) && is_black(node.left.left)) {
          this.current_nodes = [node, node.left, node.left.left, node.right];
          this.update_nodes.add(node.left).add(node.right).add(node.left.left);
          if(node.right !== null) {
            this.current_nodes.push(node.right.left);
            this.update_nodes.add(node.right.left);
          }

          // moveRedLeft(node)
          node.flip_colors();
          yield;

          const right = node.right;
          if(right !== null && is_red(right.left)) {
            this.update_nodes.add(right.left);
            right.rotate_right();
            yield;

            node = node.rotate_left();
            if(node.prt === null) {
              this.root = node;
            }
            yield;

            node.flip_colors();
            yield;
          }
        }
        node = node.left;
      } else {
        if(is_red(node.left)) {
          this.current_nodes = [node, node.left];
          node = node.rotate_right();
          if(node.prt === null) {
            this.root = node;
          }
          this.update_nodes.add(node);
          yield;
        }
        if(node.val === x && node.right === null) {
          const prt = node.prt;
          if(prt !== null) {
            prt.remove_child(node);
          } else {
            this.root = null;
          }
          this.current_nodes = [];

          yield node;
          node = prt;
          break;
        }
        if(is_black(node.right) && is_black(node.right.left)) {
          // moveRedRight(node)
          this.current_nodes = [node, node.left, node.right, node.right.left];
          this.update_nodes.add(node.right.left);
          if(node.left !== null) {
            this.current_nodes.push(node.left.left);
            this.update_nodes.add(node.left.left);
          }

          node.flip_colors();
          this.update_nodes.add(node.left);
          this.update_nodes.add(node.right);
          yield;

          if(node.left !== null && is_red(node.left.left)) {
            node = node.rotate_right();
            if(node.prt === null) {
              this.root = node;
            }
            yield;

            node.flip_colors();
            this.update_nodes.add(node.left);
            yield;
          }
        }
        if(node.val === x) {
          const prt = node.prt;

          // deleteMin(node.right)

          // find a minimum key in node.right
          let c_node = node.right;
          while(c_node.left !== null) {
            this.update_nodes.add(c_node);
            if(is_black(c_node.left) && is_black(c_node.left.left)) {
              // moveRedLeft(c_node)
              this.current_nodes = [c_node, c_node.left, c_node.left.left, c_node.right];
              if(c_node.right !== null) {
                this.current_nodes.push(c_node.right.left);
                this.update_nodes.add(c_node.right.left);
              }

              c_node.flip_colors();
              this.update_nodes.add(node.left);
              this.update_nodes.add(node.right);
              yield;

              const right = c_node.right;
              if(right !== null && is_red(right.left)) {
                this.update_nodes.add(right.left);
                right.rotate_right();
                yield;

                c_node = c_node.rotate_left();
                yield;

                c_node.flip_colors();
                yield;
              }
            }
            c_node = c_node.left;
          }
          this.update_nodes.add(c_node);
          this.current_nodes = [node, c_node];

          // move c_node to node's position
          const c_prt = c_node.prt;
          let is_child = node.is_right(c_node);
          if(!is_child) {
            c_prt.set_left(c_node.right);
            c_node.set_right(node.right);
          }
          c_node.set_left(node.left);
          if(prt !== null) {
            if(x < prt.val) {
              prt.set_left(c_node);
            } else {
              prt.set_right(c_node);
            }
          } else {
            node.remove_right();
            this.root = c_node;
          }
          c_node.color = node.color;

          yield node;
          node = (is_child ? c_node : c_prt);
          break;
        }
        node = node.right;
      }
    }

    while(node !== null) {
      // fixUp(node)
      if(is_red(node.right) && is_black(node.left)) {
        this.current_nodes = [node, node.left, node.right];
        this.update_nodes.add(node.left).add(node.right);
        node = node.rotate_left();
        if(node.prt === null) {
          this.root = node;
        }
        yield;
      }
      if(is_red(node.left) && is_red(node.left.left)) {
        this.current_nodes = [node, node.left, node.left.left, node.right];
        this.update_nodes.add(node.left).add(node.left.left);
        node = node.rotate_right();
        if(node.prt === null) {
          this.root = node;
        }
        yield;
      }
      if(is_red(node.left) && is_red(node.right)) {
        node.flip_colors();
        this.current_nodes = [node, node.left, node.right];
        this.update_nodes.add(node.left).add(node.right);
        yield;
      }
      node = node.prt;
    }
    if(is_red(this.root)) {
      this.current_nodes = [this.root];
      this.root.color = Node.BLACK;
      yield;
    }
    this.current_nodes = [];
    yield;
  }

  get_update_nodes() {
    return Array.from(this.update_nodes.values()).filter(node => node !== null);
  }

  get_current_nodes() {
    return this.current_nodes.filter(node => node !== null);
  }
}

window.onload = () => {
  const tree = new LeftLeaningRedBlackTree();

  const node_view = {}, node_map = {};
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
      "nid": n_id,
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
    const t_view = t_node && node_view[t_node.val].node;
    const c_views = (c_nodes !== null ? c_nodes.map(node => node_view[node.val].node) : []);
    tl.add({
      targets: ['circle.node-circle'],
      stroke: [{value: (el) => {
        const n_id = el.parentNode.getAttribute("nid");
        const node = node_map[n_id];
        return (node.color === Node.RED ? "#ff0000" : "#000000");
      }}],
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

    tl.add({ duration: 500 });

    let max_depth = 0;
    {
      const result_m = traverse(tree.root);
      translate_obj(result_m.ps, null, null);
      max_depth = result_m.depth;
    }

    let v_n_id = null;
    let target_node = null;

    if(tree.find(v)) {
      const step = tree.remove(v);
      let deleted = false;
      const t_node = node_map[node_view[v].nid];
      while(true) {
        const {value: node, done: done} = step.next();
        if(done) break;

        if(node) {
          // assert (node.val === x);
          v_n_id = node.id;
          target_node = node_view[v].node;

          hide_nodes(tl, [`g.node${v_n_id}`], [`path.edge${v_n_id}`]);

          deleted = true;
        }

        const {ps: result, depth: depth} = traverse(tree.root);
        max_depth = Math.max(max_depth, depth);
        if(deleted) {
          result[v_n_id] = [0, 0];
        }

        const c_nodes = tree.get_current_nodes();
        translate_obj(result, t_node, c_nodes);
      }

      delete node_view[v];
      delete node_map[v_n_id];
    }

    tl.add({ duration: 500 });

    const update_nodes = tree.get_update_nodes().filter(node => node.val !== v).map(node => node_view[node.val].node);
    tl.changeBegin = () => {
      begin_change_color(target_node, update_nodes);
    };
    tl.changeComplete = () => {
      end_change_color(target_node, update_nodes);
    };
    delete_n_id = v_n_id;

    change_canvas_size(
      (node_num+1) * NODE_W + BASE_X*2,
      (max_depth+1) * NODE_H + BASE_Y*2
    );
  };

  const add_tree_node = (v) => {
    init_timeline();

    tl.add({ duration: 500 });

    let max_depth = traverse(tree.root).depth;

    if(!tree.find(v)) {
      const step = tree.insert(v);
      let t_node = null;
      while(true) {
        const {value: node, done: done} = step.next();
        if(done) break;

        if(node) {
          add_node(v, node);
          t_node = node;
        }

        const {ps: result, depth: depth} = traverse(tree.root);
        max_depth = Math.max(max_depth, depth);

        const c_nodes = tree.get_current_nodes();
        translate_obj(result, t_node, c_nodes);
      }
    }

    tl.add({ duration: 500 });

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
      (node_num+1) * NODE_W + BASE_X*2,
      (max_depth+1) * NODE_H + BASE_Y*2
    );
  };

  const check_constraints = () => {
    let base_depth = -1;
    const leaves = [];
    let failed = 0;

    const dfs = (node, prt, bdep) => {
      if(node === null) {
        if(prt) leaves.push([prt, bdep+1]);
        return;
      }
      if(node.color === 0) {
        ++bdep;
      }
      dfs(node.left, node, bdep);
      if(is_red(node) && is_red(prt)) {
        console.log("F: red and red", node, prt);
        failed = 1;
      }
      if(is_red(node.right)) {
        console.log("F: not left-leaning", node, node.right);
        failed = 1;
      }
      dfs(node.right, node, bdep);
    };
    if(tree.root !== null && tree.root.color === Node.RED) {
      console.log("F: root is red", tree.root);
        failed = 1;
    }
    dfs(tree.root, null, 0);
    let max_depth = 0;
    leaves.forEach
    for(let [node, bdep] of leaves) {
      max_depth = Math.max(max_depth, bdep);
    }
    if(leaves.some((e) => e[1] !== max_depth)) {
      for(let [node, bdep] of leaves) {
        console.log("F: black depth", node, bdep, max_depth);
        failed = 1;
      }
    }
    console.log("checked");
    return failed;
  };

  set_add_random(add_tree_node);
  set_remove_random(remove_tree_node, node_view);
  set_add_inc(add_tree_node);
  set_add_dec(add_tree_node);
  set_add_value(add_tree_node);
  set_remove_value(remove_tree_node);
};
