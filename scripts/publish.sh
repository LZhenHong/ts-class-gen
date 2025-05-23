#!/usr/bin/env bash
# Written in [Amber](https://amber-lang.com/)
# version: 0.4.0-alpha
# date: 2025-05-23 23:33:29

dir_exists__32_v0() {
    local path=$1
     [ -d "${path}" ] ;
    __AS=$?;
if [ $__AS != 0 ]; then
        __AF_dir_exists32_v0=0;
        return 0
fi
    __AF_dir_exists32_v0=1;
    return 0
}
__0_dist="dist"
declare -r tag=("$0" "$@")
    dir_exists__32_v0 "${__0_dist}";
    __AF_dir_exists32_v0__6_8="$__AF_dir_exists32_v0";
    if [ "$__AF_dir_exists32_v0__6_8" != 0 ]; then
        rm -rf ${__0_dist};
        __AS=$?;
if [ $__AS != 0 ]; then

exit $__AS
fi
fi
    npm run build;
    __AS=$?;
if [ $__AS != 0 ]; then

exit $__AS
fi
    npm version patch;
    __AS=$?;
if [ $__AS != 0 ]; then

exit $__AS
fi
    npm publish;
    __AS=$?;
if [ $__AS != 0 ]; then

exit $__AS
fi
