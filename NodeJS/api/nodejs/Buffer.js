/**
 * @file NodeJs数据缓冲区 Buffer
 * Js本身只有字符串数据类型 没有二级制数据类型.
 * 当处理TCP或者文件流时必须用到二级制.所以在Node中定义了一个Buffer类用于创建一个专门存放二进制数据的缓存区.
 * 当NodeJs在处理IO操作中移动数据时就有可能使用Buffer库.一个Buffer类似于一个整数数组,但对应于V8堆内存之外的一块原始内存.
 */

/**
 * @dis 常用API
 *    
 *    - buffer = new Buffer(Number/Array/String,encoding)
 *      Buffer实例的第一个参数代表实例化内容,第二个参数表示编码方式默认为utf-8
 *    
 *    - buffer.write(string,[offset],[length],[encoding]) 返回实际写入字节大小
 *      offset开始索引
 *      length写入的字节数,默认为buffer.length
 *      encoding使用的编码格式
 * 
 *      - buffer.toString([encoding],[start],[end]) // buffer转码 可以将二进制文件转化为对应的字符编码 比如utf8 
 *      - buffer.toJSON() // 返回JSON对象
 *      - buffer.concat(list,[totalLength]); 合并,第二个参数指定合并完的总长度
 *      - Buffer.concat([list1,list2]) 合并
 *      - buffer1.compare(buffer2) 比较
 *        返回值小于0 前半部分相同
 *        等于0 相同
 *        大于0 后半部分相同
 *      
 *      - buffer.copy(targetBuffer,[targetStart],[sourceStart],[sourceEnd]) 复制
 *      - buffer.slice(start,end) 裁剪
 * 
 * */ 


/**
 * @注意
 *  - Buffer的类数组的处理一定会改变原数据 操作前应该copy一份。
 * 
 * */ 