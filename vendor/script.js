
$(document).ready(function () {
    var _sysid;
    var baseUrl = 'http://localhost:8899/';
    $('.mdb-select').change(function () {
        $(".js-list").empty();
        $("form").css("display","none");
        _sysid = $(this).val();
        $.get(baseUrl + "get-by-system-id/"+_sysid, function (data) {
            var sys1 =  data || [];
            console.log(sys1);
            sys1.forEach(function (level1Item,i) {
                console.log(level1Item._name);

                $(".js-list").append('<span class="js-enty level'+i+'">'+level1Item._name+'</span>');

                let className = "level"+i+"-list-"+level1Item._name;
                $("span.level"+i).append('<ul class="'+className+'"></ul>');
                level1Item.EntityTypes.forEach(function (level2Item) {
                    $("ul."+className).append('<li class="js-enty" _groupName="'+level1Item._name+'" _groupId="'+level1Item._groupId+'" _entityTypeId="'+level2Item._entityTypeId+'">'+level2Item._name+'</li>');
                });

            });
            $("li.js-enty").click(function (event ) {
                event.preventDefault();
                var entity = $(this);
                var enttiiyId = $(this).attr('_entitytypeid');
                var reqUrl = "get-by-entity-id/"+enttiiyId;
                console.log(reqUrl);
                $.get(baseUrl + reqUrl, function (data) {
                    console.log(entity.attr("_groupname"));
                    $("form").css("display","block");
                    $("form").attr("_entitytypeid",enttiiyId);
                    $("input.js-name").val(data._name);
                    $("input.js-id").val(enttiiyId);
                    $("input.js-group-name").val(entity.attr("_groupname"));
                    $("img.js-icon").attr("src",data.Icon._iconName);
                });
            });

            $("button.js-submit").click(function (event) {
                event.preventDefault();
                $.ajax({
                    type: "POST",
                    url: baseUrl+"update-entity",
                    data: JSON.stringify({ "id": $("form").attr("_entitytypeid"), "name": $("input.js-name").val() }),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function(data){
                        alert(data);
                    },
                    failure: function(errMsg) {
                        alert(errMsg);
                    }
                });
            })

        });
    });


});