#设置基础镜像
FROM nginx
#镜像创建者的信息
#MAINTAINER maxiaobin "maxiaobin001@chinasoftinc.com"

#WORKDIR /home/apps/

RUN ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime && \
    echo "Asia/Shanghai" > /etc/timezone
	
#将dist文件中的内容复制到 /usr/share/nginx/html/ 这个目录下面
COPY dist/  /usr/share/nginx/html/

#ADD ca/ /etc/nginx/ca/

#删除nginx 默认配置
RUN rm /etc/nginx/conf.d/default.conf
#添加自己的配置 default.conf 在下面
ADD default.conf /etc/nginx/conf.d/
#使用自定义nginx.conf配置端口和监听
#COPY nginx.conf /etc/nginx/nginx.conf

RUN ln -sf /dev/stdout /var/log/nginx/broker.access.log \
	&& ln -sf /dev/stderr /var/log/nginx/broker.error.log
  
#EXPOSE 8088

CMD ["nginx","-g","daemon off;"]