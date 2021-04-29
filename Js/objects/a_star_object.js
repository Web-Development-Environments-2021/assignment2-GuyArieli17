class AStar{
    constructor(board){
        this.board = board;
    }

    getChildPosition(position){
        let [y,x] = position;
        let neighbor  =[
            [y+1,x],
            [y-1,x],
            [y,x+1],
            [y,x-1],
        ]
        let lst = []
        neighbor.forEach(([n_y,n_x])=>{
            if( n_y >=0 && n_y < this.board.length && x>=0 && x < this.board[y].length){
                if( this.board[n_y][n_x] !== 1){
                    lst.push([n_y,n_x]);
                }
            } 
        });
        return lst;
    }

    heuristic(current,to){
        let [cur_y,cur_x] = current;
        let [to_y,to_x] = to;
        return Math.sqrt(Math.pow(to_y-cur_y,2) + Math.pow(to_x-cur_x,2));
    }

    add(open,node){
        let index = 0;
        while(index < open.length && node.compare(open[index]) <= 0){index += 1}
        if(index >= open.length){open.push(node)}
        else{open.splice(index, 0,node)}
    }

    remove(open,node){
        let index = 0;
        while(index < open.length && node.compare(open[index]) == 0){index += 1}
        if(index < open.length){open.splice(index,1)}
    }

    comparePos(p1,p2){
        let [y1,x1] = p1;
        let [y2,x2] = p2;
        return x1 == x2 && y1 == y2;
    }

    findPath(start_pos,goal_pos){
         // Initialize both open and closed list
        let open = [];
        let open_dic ={}
        let close = new Set();
        let goal = null;
        let MAX_ROTUE = 22;
        //put the startNode on the openList (leave it's f at zero
        let startNode = new Node(start_pos,0,this.heuristic(start_pos,goal_pos))
        this.add(open,startNode)
        open_dic[start_pos] = startNode;
        // Loop until you find the end
        let currentNode;
        while(open.length > 0 && MAX_ROTUE > 0){
            // console.log(open);
            // Get the current node
            currentNode = open.pop() ;
            //add the currentNode to the closedList
            close.add((currentNode.position));
            // Found the goal
            if (this.comparePos(currentNode.position,goal_pos)){goal=currentNode;break;}
            // Generate children
            let children_pos = this.getChildPosition(currentNode.position);
            children_pos.forEach( (pos) =>{
                if(pos in close){return;}
                // Create the f, g, and h values
                let g_val = currentNode.g + 1
                let h_val = this.heuristic(pos,goal_pos)
                let childNode = new Node(pos,g_val,h_val)
                // Child is already in openList
                if(childNode.position in open_dic){
                    if(childNode.f < open_dic[childNode.pos].f){
                        this.remove(open, open_dic[childNode.pos]);
                        open_dic[childNode.pos] = childNode;
                        childNode.prev = currentNode;
                        this.add(open,childNode);
                    }
                }   
                else if(!(childNode.position in close)){
                    this.add(open,childNode)
                    childNode.prev = currentNode;
                    open_dic[childNode.pos] = childNode
                }
            });
            close.add(currentNode.position);
            MAX_ROTUE--;
        }
        let lst = []
        if(goal != null){
            while(goal != null){
                lst.splice(0,0,goal.position);
                goal = goal.prev;
            }
        }
        else{
              while(currentNode != null){
                lst.splice(0,0,currentNode.position);
                currentNode = currentNode.prev;
            }
        }
        return lst
    }
}

