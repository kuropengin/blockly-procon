//server.jsを機能ごとに分割中

//player action

function get_ready(room,chara,id=false){
    if(server_store[room][chara].turn && server_store[room][chara].getready){
        var my_map_data = [];
        var tmp_map_data = Array.from(server_store[room].map_data);
        var now_x = server_store[room][chara].x;
        var now_y = server_store[room][chara].y;
        var load_map_size_x = server_store[room].map_size_x;
        var load_map_size_y = server_store[room].map_size_y;


        for(var y of [-1,0,1]){
            if(0 > (now_y + y) || (load_map_size_y - 1) < (now_y + y)){
                for(var x of [-1,0,1]){
                    my_map_data.push(2);
                }
            }
            else{
                for(var x of [-1,0,1]){
                    if(0 > (now_x + x) || (load_map_size_x - 1) < (now_x + x)){
                        my_map_data.push(2);
                    }
                    else{
                        if(tmp_map_data[now_y][now_x] == 3){
                            if(tmp_map_data[now_y + y][now_x + x] == 3){
                                my_map_data.push(0); 
                            }
                            else if(tmp_map_data[now_y + y][now_x + x] == 4){
                                my_map_data.push(1); 
                            }
                            else{
                                if(tmp_map_data[now_y + y][now_x + x] == 0){
                                    my_map_data.push(tmp_map_data[now_y + y][now_x + x]);
                                }
                                else if(tmp_map_data[now_y + y][now_x + x] == 1){
                                    my_map_data.push(2);
                                }
                                else{
                                    my_map_data.push(3);
                                }
                            }
                        }
                        else if(tmp_map_data[now_y][now_x] == 4){
                            if(tmp_map_data[now_y + y][now_x + x] == 3){
                                my_map_data.push(1); 
                            }
                            else if(tmp_map_data[now_y + y][now_x + x] == 4){
                                my_map_data.push(0); 
                            }
                            else{
                                if(tmp_map_data[now_y + y][now_x + x] == 0){
                                    my_map_data.push(tmp_map_data[now_y + y][now_x + x]);
                                }
                                else if(tmp_map_data[now_y + y][now_x + x] == 1){
                                    my_map_data.push(2);
                                }
                                else{
                                    my_map_data.push(3);
                                }
                            }
                        }
                        else{
                            if(tmp_map_data[now_y + y][now_x + x] == 43 || tmp_map_data[now_y + y][now_x + x] == 34){
                                my_map_data.push(1); 
                            }
                            else{
                                if(tmp_map_data[now_y + y][now_x + x] == 0){
                                    my_map_data.push(tmp_map_data[now_y + y][now_x + x]);
                                }
                                else if(tmp_map_data[now_y + y][now_x + x] == 1){
                                    my_map_data.push(2);
                                }
                                else{
                                    my_map_data.push(3);
                                } 
                            } 
                        }
                    }
                }
            }
        }
        if(id){
            io.to(id).emit('get_ready_rec',{
                "rec_data":my_map_data
            });
            server_store[room][chara].getready = false;
        }
        else{
            server_store[room][chara].getready = false;
            return my_map_data;
        }
    }
    else{
        if(id){
            io.to(id).emit('get_ready_rec',{
                "rec_data":server_store[room][chara].true
            });
        }
        else{
            return false;
        }
    }  
}

function move_player(room,chara,msg,id=false){
    if(server_store[room][chara].turn && server_store[room][chara].getready == false){
        server_store[room][chara].turn = false;
        server_store[room][chara].getready = true;
        var x = server_store[room][chara].x;
        var y = server_store[room][chara].y;

        var xy_check = false;
        var chara_num = {"cool":3,"hot":4};
        var chara_num_diff = {"cool":4,"hot":3};

        var move_map_data = [];

        if(server_store[room].map_data[y][x] == 34){
            server_store[room].map_data[y][x] = chara_num_diff[chara];
        }
        else{
            server_store[room].map_data[y][x] = 0;
        }

        if(msg === "top"){
            if(0 <= y - 1){
                server_store[room][chara].y = y - 1;
                y = y - 1;
                xy_check = true;
            }
        }
        else if(msg === "bottom"){
            if(server_store[room].map_size_y > y + 1){
                server_store[room][chara].y = y + 1;
                y = y + 1;
                xy_check = true;
            }
        }
        else if(msg === "left"){
            if(0 <= x - 1){
                server_store[room][chara].x = x - 1;
                x = x - 1;
                xy_check = true;
            }
        }
        else{
            if(server_store[room].map_size_x > x + 1){
                server_store[room][chara].x = x + 1;
                x = x + 1;
                xy_check = true;
            }
        }

        if(xy_check){
            if(server_store[room].map_data[y][x] == 0){
                server_store[room].map_data[y][x] = chara_num[chara];
            }
            else if(server_store[room].map_data[y][x] == 2){
                server_store[room].map_data[y][x] = chara_num[chara];
                server_store[room][chara].score += 1;

                if(msg === "top"){
                    server_store[room].map_data[y + 1][x] = 1;
                }
                else if(msg === "bottom"){
                    server_store[room].map_data[y - 1][x] = 1;
                }
                else if(msg === "left"){
                    server_store[room].map_data[y][x + 1] = 1;
                }
                else{
                    server_store[room].map_data[y][x - 1] = 1;
                }

            }
            else if(server_store[room].map_data[y][x] == chara_num_diff[chara]){
                server_store[room].map_data[y][x] = 34;
            }

            var tmp_map_data = Array.from(server_store[room].map_data);
            var x_range = [-1,0,1];
            var y_range = [-1,0,1];
            var load_map_size_x = server_store[room].map_size_x;
            var load_map_size_y = server_store[room].map_size_y;

            for(var _y of y_range){
                for(var _x of x_range){
                    if(0 > (_x + x) || (load_map_size_x - 1) < (_x + x) || 0 > (_y + y) || (load_map_size_y - 1) < (_y + y)){
                        move_map_data.push(2);
                    }
                    else{
                        if(tmp_map_data[_y + y][_x + x] == chara_num_diff[chara] || tmp_map_data[_y + y][_x + x] == 34){
                            move_map_data.push(1);
                        }
                        else{
                            if(tmp_map_data[_y + y][_x + x] == 0 || tmp_map_data[_y + y][_x + x] == chara_num[chara]){
                                move_map_data.push(0);
                            }
                            else if(tmp_map_data[_y + y][_x + x] == 1){
                                move_map_data.push(2);
                            }
                            else{
                                move_map_data.push(3);
                            } 
                        } 
                    }
                }
            }
            if(id){
                io.to(id).emit('move_rec',{
                    "rec_data":move_map_data
                });
            }
        }   

        game_result_check(room,chara);

        if(!id){
            return move_map_data;
        }
    }
}

function look(room,chara,msg,id=false){
    if(server_store[room][chara].turn && server_store[room][chara].getready == false){
        server_store[room][chara].turn = false;
        server_store[room][chara].getready = true;
        var x_range = [];
        var y_range = [];

        var tmp_map_data = Array.from(server_store[room].map_data);
        var now_x = server_store[room][chara].x;
        var now_y = server_store[room][chara].y;
        var load_map_size_x = server_store[room].map_size_x;
        var load_map_size_y = server_store[room].map_size_y;

        var chara_num_diff = {"cool":4,"hot":3};

        if(msg == "top"){
            x_range = [-1,0,1];
            y_range = [-3,-2,-1];
        }else if(msg == "bottom"){
            x_range = [-1,0,1];
            y_range = [1,2,3];
        }else if(msg == "left"){
            x_range = [-3,-2,-1];
            y_range = [-1,0,1];
        }else{
            x_range = [1,2,3];
            y_range = [-1,0,1];
        }
        var look_map_data = [];

        for(var y of y_range){
            for(var x of x_range){
                if(0 > (now_x + x) || (load_map_size_x - 1) < (now_x + x) || 0 > (now_y + y) || (load_map_size_y - 1) < (now_y + y)){
                    look_map_data.push(2);
                }
                else{
                    if(tmp_map_data[now_y + y][now_x + x] == chara_num_diff[chara] || tmp_map_data[now_y + y][now_x + x] == 34){
                        look_map_data.push(1);
                    }
                    else{
                        if(tmp_map_data[now_y + y][now_x + x] == 0){
                            look_map_data.push(tmp_map_data[now_y + y][now_x + x]);
                        }
                        else if(tmp_map_data[now_y + y][now_x + x] == 1){
                            look_map_data.push(2);
                        }
                        else{
                            look_map_data.push(3);
                        } 
                    } 
                }
            }
        }
        if(id){
            io.to(id).emit('look_rec',{
                "rec_data":look_map_data
            });
            game_result_check(room,chara,"l",msg);
        }
        else{
            game_result_check(room,chara,"l",msg);
            return look_map_data;
        }
    }
    else{
        if(id){
            io.to(id).emit('look_rec',{
                "rec_data":server_store[room][chara].true
            });
        }
        else{
            return false;
        }
    }
}

function search(room,chara,msg,id=false){
    if(server_store[room][chara].turn && server_store[room][chara].getready == false){
        server_store[room][chara].turn = false;
        server_store[room][chara].getready = true;
        var x_range = [];
        var y_range = [];

        var tmp_map_data = Array.from(server_store[room].map_data);
        var now_x = server_store[room][chara].x;
        var now_y = server_store[room][chara].y;
        var load_map_size_x = server_store[room].map_size_x;
        var load_map_size_y = server_store[room].map_size_y;

        var chara_num_diff = {"cool":4,"hot":3};

        if(msg == "top"){
            x_range = [0];
            y_range = [-1,-2,-3,-4,-5,-6,-7,-8,-9];
        }else if(msg == "bottom"){
            x_range = [0];
            y_range = [1,2,3,4,5,6,7,8,9];
        }else if(msg == "left"){
            x_range = [-1,-2,-3,-4,-5,-6,-7,-8,-9];
            y_range = [0];
        }else{
            x_range = [1,2,3,4,5,6,7,8,9];
            y_range = [0];
        }

        var look_map_data = [];

        for(var y of y_range){
            for(var x of x_range){
                if(0 > (now_x + x) || (load_map_size_x - 1) < (now_x + x) || 0 > (now_y + y) || (load_map_size_y - 1) < (now_y + y)){
                    look_map_data.push(2);
                }
                else{
                    if(tmp_map_data[now_y + y][now_x + x] == chara_num_diff[chara] || tmp_map_data[now_y + y][now_x + x] == 34){
                        look_map_data.push(1);
                    }
                    else{
                        if(tmp_map_data[now_y + y][now_x + x] == 0){
                            look_map_data.push(tmp_map_data[now_y + y][now_x + x]);
                        }
                        else if(tmp_map_data[now_y + y][now_x + x] == 1){
                            look_map_data.push(2);
                        }
                        else{
                            look_map_data.push(3);
                        } 
                    } 
                }
            }
        }
        if(id){
            io.to(id).emit('search_rec',{
                "rec_data":look_map_data
            });
            game_result_check(room,chara,"s",msg);
        }
        else{
            game_result_check(room,chara,"s",msg);
            return look_map_data;
        }
    }
    else{
        if(id){
            io.to(id).emit('search_rec',{
                "rec_data":server_store[room][chara].true
            });
        }
        else{
            return false;
        }
    }
}

function put_wall(room,chara,msg,id=false){
    if(server_store[room][chara].turn && server_store[room][chara].getready == false){
        server_store[room][chara].turn = false;
        server_store[room][chara].getready = true;
        var x = server_store[room][chara].x;
        var y = server_store[room][chara].y;

        var put_check = false;

        if(msg === "top"){
            if(0 <= y - 1){
                y = y - 1;
                put_check = true;
            }
        }
        else if(msg === "bottom"){
            if(server_store[room].map_size_y > y + 1){
                y = y + 1;
                put_check = true;
            }
        }
        else if(msg === "left"){
            if(0 <= x - 1){
                x = x - 1;
                put_check = true;
            }
        }
        else{
            if(server_store[room].map_size_x > x + 1){
                x = x + 1;
                put_check = true;
            }
        }

        var chara_num = {"cool":3,"hot":4};
        var chara_num_diff = {"cool":4,"hot":3};
        var player_put_chara = false;

        if(put_check){
            if(server_store[room].map_data[y][x] == chara_num_diff[chara]){
                player_put_chara = true;
            }
            server_store[room].map_data[y][x] = 1;
        }

        var tmp_map_data = Array.from(server_store[room].map_data);
        var put_map_data = [];
        var now_x = server_store[room][chara].x;
        var now_y = server_store[room][chara].y;
        var x_range = [-1,0,1];
        var y_range = [-1,0,1];
        var load_map_size_x = server_store[room].map_size_x;
        var load_map_size_y = server_store[room].map_size_y;


        for(var _y of y_range){
            for(var _x of x_range){
                if(0 > (_x + now_x) || (load_map_size_x - 1) < (_x + now_x) || 0 > (_y + now_y) || (load_map_size_y - 1) < (_y + now_y)){
                    put_map_data.push(2);
                }
                else{
                    if(tmp_map_data[_y + now_y][_x + now_x] == chara_num_diff[chara] || tmp_map_data[_y + now_y][_x + now_x] == 34){
                        put_map_data.push(1);
                    }
                    else{
                        if(tmp_map_data[_y + now_y][_x + now_x] == 0 || tmp_map_data[_y + now_y][_x + now_x] == chara_num[chara]){
                            put_map_data.push(0);
                        }
                        else if(tmp_map_data[_y + now_y][_x + now_x] == 1){
                            put_map_data.push(2);
                        }
                        else{
                            put_map_data.push(3);
                        } 
                    } 
                }
            }
        }

        if(id){
            io.to(id).emit('put_rec',{
                "rec_data":put_map_data
            });
            if(player_put_chara){
                game_result_check(room,chara , "r", false, false,"putより");
            }
            else{
                game_result_check(room,chara);
            }
        }
        else{
            if(player_put_chara){
                game_result_check(room,chara , "r", false, false,"putより");
            }
            else{
                game_result_check(room,chara);
            }
            return put_map_data;
        }
    }
}

exports.get_ready = get_ready;
exports.move_player = move_player;
exports.look = look;
exports.search = search;
exports.put_wall = put_wall;