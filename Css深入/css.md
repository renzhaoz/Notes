# CSS

## GRID 网格布局

1. 作用在容器

      //1. grid-template-columns/grid-template-row 控制每一行/列的排列
        // grid-template-columns用法(grid-template-row的用法也可以下用法相同,产生的效果在y轴)
        grid-template-columns: 33%, 33% , 33%; === grid-template-columns: repeat(3,33%);
        grid-template-columns: repeat(2, 100px 20px 80px); // 1 4列100px 2 5列20px 3 6列80px
        grid-template-columns: repeat(autofill, 100px); // 一列100px 填充满整个容器
        grid-template-columns: 1fr 1fr; // 二等分
        grid-template-columns: 150px 1fr 2fr; // 第一列150px 其余的等比例分3份 第三列占2份
        grid-template-columns: 1fr 1fr minmax(100px, 1fr); // 第三列最少100px 最多占均分3份中的一份宽度
        grid-template-columns: 100px auto 100px;  // 中间宽度自适应
      //2. place-items
        place-items:center // 子集始终上下左右居中
      //3. grid-template
        grid-template: rows/columns; // 设置rows/columns排列 grid-template-areas为none
      //4. grid-gap
        grid-gap:10px; // 设置相邻元素间隔10px

2. 作用在子集
      //1. grid-colum
      //2. grid-row
      //3. width:clamp(23ch, 50%, 46ch); // 实现文字展示效果 使得多行文字时不会让哪一行很长  也不会让那一行很短
      .child{
        grid-colum:1/3; // 从第一网格占用到第三网格 等价于 1/span 2(从1列开始 横跨2列);
        grid-row: 1/3; // 从第一网格占用到第三网格
      }

> 实例

      // 常见面试题 上下左右居中
      .parent{
        display: grid;
        place-items: center;
      }
      // 自适应的侧边栏
      .parent{
        display:grid;
        grid-template-columns:minmax(150px,1fr) 1fr;
      }
      // 上中下布局 自适应的Header Content Footer
      .parent{
        display:grid;
        grid-template-rows:auto 1fr auto; // 中间部分尽可能的大 若上下两部分没内容则高度为0
      }
      // 圣杯布局 上 中(左中右) 下
      .parent{
        display:grid;
        grid-template: auto 1fr auto / auto 1fr auto; // rows/columns 这里将整个容器上中下 左中右都分为三份(总共分为9个网格 child子集从第一个开始从左到右 从上到下依次排列,不够9个子集的 有几个展示几个,超过9个子集的 继续创建网格)
      }
      .header{
        grid-columns: 1/4; // 将列宽均分为4份 从第一列横跨到第四列 即占满整列(第一行已被占满 第二个元素将会放到第二行 以下所有行的列宽也会分为4份)
      }
      .middle{
        grid-column:2/3; // 在被均分为4份的主轴上 从第二份横跨到第三份 即占两份
      }
      .middleLeft{
        grid-column:1/2;
      }
      .middleRight{
        grid-column:3/4;
      }
      .footer{
        grid-column:1/4; // 占满
      }
      // card list 自动换行
      .parent{
        display:grid;
        grid-grep:20px;
        grid-template-columns:repeat(auto-fit,minmax(150px, 1fr)); // 自动占满整行 如果只有一个元素则元素放大到占满(改为auto-fill 容器宽度增加到一定程度 子集宽度保持到150px不会缩放 尽可能放更多的子集. 但是当容器宽度为200px、280px这种多放一个放不下时 行为和auto-fit一致 他将会放大子集的宽度) 
      }

## position: sticky

吸顶布局

## aspect-ratio 

设置纵横比

## content-visibility:auto

不渲染和加载不可视部分内容

## object-fit

让一个内部元素自适应外部容器(填充/保持原尺寸/高宽一致/...)

## clip-path 按路径裁剪元素

## mix-blend-mode 元素重合部分显示规则

## CSS 滤镜

去色/模糊/高光/新鲜度

## CSS scroll-snap-type/scroll-snap-align 滚动捕作

保证多个子集的滚动 每次滚动结束都展示完整的子集内容 不会有裁剪和遮挡

## overscroll-behavior 阻止外部滚动

当内部元素滚动到结尾时 再滚动内容不会滚动外部元素

## line-clamp 用于限定容器中展示文字的行数

## css 变量

      :root{
        --bg: red;// 全局变量
      }
      a{background:--bg}

## @supports 监测环境是否支持css某一属性

## contain:strict 隔离元素

隔离元素后 隔离的元素样式独立 不会受到其他元素污染

## will-change 预告知

提前备案 告诉浏览器 变化属性

## calc 计算属性

## 比较属性min max

height:min(100px,200px,300px)

## FlexBox 布局

      flex: flex-grow,flex-shrink,flex-basis 默认值是0 1 auto;
        flex-grow定义项放大比例 默认为0(有空间也不缩放)
        flex-shrink定义了项目的缩小比例 默认为1(空间不足时缩小)
        flex-basis定义在分配空间之前所占的主轴空间 浏览器会根据这个属性计算主轴是否有多余空间 默认值为auto(本来所占空间的大小)

      // 居中显示 允许放大 允许缩小 最大主轴宽度150px
      .parent{
        display:flex;
        flex-wrap:wrap;
        justify-content:center;
      }

      .child{
        flex: 1 1 150px;
        margin: 5px;
      }



## object-fit

设置图片展示位置(非背景),浏览器会自动根据父级元素自动计算图片位置

			img{
				width:100%;
				height:100%;
				object-fit:cover;
			}




















